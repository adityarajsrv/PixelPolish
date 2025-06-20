from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from PIL import Image, ImageOps
import io
import torch
import numpy as np
import cv2
import logging
import threading
import os

from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer
from dncnn_model import load_dncnn_model

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_realesrgan()
    load_dncnn()
    logger.info("Application startup complete with models loaded")
    yield
    logger.info("Application shutdown")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://pixelpolish.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PORT = int(os.getenv("PORT", 10000))
device = "cpu"  
logger.info(f"Using device: {device} on port {PORT}")

MAX_PROCESSING_SIZE = (256, 256)  
MAX_FILE_SIZE = 10 * 1024 * 1024  
FACE_DETECTION_THRESHOLD = 5 * 1024 * 1024  
MAX_WIDTH, MAX_HEIGHT = MAX_PROCESSING_SIZE  


upscaler = None
dncnn_model = None
processing_lock = threading.Lock()

def load_realesrgan():
    global upscaler
    if upscaler is None:
        logger.info("Loading RealESRGAN model...")
        model = RRDBNet(
            num_in_ch=3, num_out_ch=3, num_feat=64,
            num_block=23, num_grow_ch=32, scale=4
        )
        upscaler = RealESRGANer(
            scale=2,  
            model_path="weights/RealESRGAN_x4plus.pth",
            model=model,
            tile=50,  
            tile_pad=5,
            pre_pad=0,
            half=False,  
            device=device
        )
    return upscaler

def load_dncnn():
    global dncnn_model
    if dncnn_model is None:
        logger.info("Loading DnCNN model...")
        dncnn_model = load_dncnn_model("weights/dncnn_rgb.pth", device)
    return dncnn_model

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def denoise_with_tiling(model, img_t, tile=64, tile_pad=8):  
    logger.info(f"Denoising with tile size {tile}")
    b, c, h, w = img_t.size()
    output = torch.zeros_like(img_t)
    weight = torch.zeros_like(img_t)

    for y in range(0, h, tile):
        for x in range(0, w, tile):
            y0 = max(y - tile_pad, 0)
            y1 = min(y + tile + tile_pad, h)
            x0 = max(x - tile_pad, 0)
            x1 = min(x + tile + tile_pad, w)

            patch = img_t[:, :, y0:y1, x0:x1]
            with torch.no_grad():
                denoised_patch = model(patch).clamp(0, 1)

            oy0 = y
            oy1 = min(y + tile, h)
            ox0 = x
            ox1 = min(x + tile, w)

            py0 = oy0 - y0
            py1 = py0 + (oy1 - oy0)
            px0 = ox0 - x0
            px1 = px0 + (ox1 - ox0)

            output[:, :, oy0:oy1, ox0:ox1] += denoised_patch[:, :, py0:py1, px0:px1]
            weight[:, :, oy0:oy1, ox0:ox1] += 1.0

    return output / weight

def denoise_image_preserve_faces(pil_image, content_length, blend_ratio=0.3):
    logger.info(f"Denoising image of size {content_length / 1024 / 1024:.2f}MB")
    orig_np = np.array(pil_image).astype(np.uint8)
    img = orig_np.astype(np.float32) / 255.0
    img_t = torch.from_numpy(img).permute(2, 0, 1).unsqueeze(0).to(device)

    with torch.no_grad():
        denoised = denoise_with_tiling(dncnn_model, img_t, tile=64, tile_pad=8)

    denoised_np = denoised.squeeze(0).permute(1, 2, 0).cpu().numpy()
    denoised_img = (denoised_np * 255).astype(np.uint8)

    if content_length <= FACE_DETECTION_THRESHOLD:
        logger.info("Performing face detection")
        gray = cv2.cvtColor(orig_np, cv2.COLOR_RGB2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4)
        for (x, y, w, h) in faces:
            blended = cv2.addWeighted(
                orig_np[y:y+h, x:x+w], 1 - blend_ratio,
                denoised_img[y:y+h, x:x+w], blend_ratio, 0
            )
            denoised_img[y:y+h, x:x+w] = blended
    else:
        logger.info("Skipping face detection due to large image size")

    return Image.fromarray(denoised_img)

@app.get("/")
async def root():
    return {"message": "Image Enhancer API is running!"}

@app.post("/api/enhance")
async def enhance_image_api(
    image: UploadFile = File(...),
    resize: bool = Query(True, description="Auto-resize if image too large")
):
    if processing_lock.locked():
        raise HTTPException(status_code=429, detail="Another enhancement is in progress. Please try again later.")
    with processing_lock:
        try:
            contents = await image.read()
            content_length = len(contents)
            logger.info(f"Received image of size {content_length / 1024 / 1024:.2f}MB")
            if content_length > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail="Image size exceeds 10MB. Please upload a smaller image."
                )

            pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
            pil_image = ImageOps.exif_transpose(pil_image)  
            logger.info(f"Original dimensions: {pil_image.width}x{pil_image.height}")

            if pil_image.width > MAX_WIDTH or pil_image.height > MAX_HEIGHT:
                logger.info(f"Image exceeds max dimensions: {MAX_WIDTH}x{MAX_HEIGHT}")
                if resize:
                    logger.info("Resizing image...")
                    pil_image.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)
                    logger.info(f"Resized dimensions: {pil_image.width}x{pil_image.height}")
                else:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Image dimensions too large. Max size is {MAX_WIDTH}x{MAX_HEIGHT}. "
                               f"Your image is {pil_image.width}x{pil_image.height}. "
                               f"Pass ?resize=true to auto-resize."
                    )

            denoised_img = denoise_image_preserve_faces(pil_image, content_length)
            logger.info("Enhancing image with RealESRGAN...")
            enhanced, _ = upscaler.enhance(np.array(denoised_img), outscale=2)  
            logger.info(f"Enhanced dimensions: {enhanced.shape[1]}x{enhanced.shape[0]}")

            buf = io.BytesIO()
            Image.fromarray(enhanced).save(buf, format="PNG")
            buf.seek(0)
            logger.info("Enhancement complete")
            headers = {"X-Enhanced-Dimensions": f"{enhanced.shape[1]}x{enhanced.shape[0]}"}
            return StreamingResponse(buf, media_type="image/png", headers=headers)

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Enhancement failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)