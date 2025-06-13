from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps
import io
import torch
import numpy as np
import cv2
import logging

from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer
from dncnn_model import load_dncnn_model

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cuda" if torch.cuda.is_available() else "cpu"
logger.info(f"Using device: {device}")

# Constants
MAX_WIDTH, MAX_HEIGHT = 2048, 2048
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB limit
FACE_DETECTION_THRESHOLD = 5 * 1024 * 1024  # 5MB threshold for face detection

def load_realesrgan():
    logger.info("Loading RealESRGAN model...")
    model = RRDBNet(
        num_in_ch=3, num_out_ch=3, num_feat=64,
        num_block=23, num_grow_ch=32, scale=4
    )
    upscaler = RealESRGANer(
        scale=4,
        model_path="weights/RealESRGAN_x4plus.pth",
        model=model,
        tile=400,
        tile_pad=10,
        pre_pad=0,
        half=True,
        device=device
    )
    return upscaler

def load_dncnn():
    logger.info("Loading DnCNN model...")
    model = load_dncnn_model("weights/dncnn_rgb.pth", device)
    if device == "cuda":
        model = model.half()
    return model

upscaler = load_realesrgan()
dncnn_model = load_dncnn()

# Haar cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def denoise_with_tiling(model, img_t, tile=512, tile_pad=16):
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
    if device == "cuda":
        img_t = img_t.half()

    with torch.no_grad():
        denoised = denoise_with_tiling(dncnn_model, img_t, tile=512, tile_pad=16)

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

    torch.cuda.empty_cache()
    return Image.fromarray(denoised_img)

@app.get("/")
async def root():
    return {"message": "Image Enhancer API is running!"}

@app.post("/api/enhance")
async def enhance_image_api(
    image: UploadFile = File(...),
    resize: bool = Query(True, description="Auto-resize if image too large")
):
    try:
        contents = await image.read()
        content_length = len(contents)
        logger.info(f"Received image of size {content_length / 1024 / 1024:.2f}MB")
        if content_length > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="Image size exceeds 10MB. Please upload a smaller image."
            )

        # Handle EXIF orientation
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        pil_image = ImageOps.exif_transpose(pil_image)  # Correct orientation
        logger.info(f"Original dimensions: {pil_image.width}x{pil_image.height}")

        # Resize if needed
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
        enhanced, _ = upscaler.enhance(np.array(denoised_img), outscale=4)
        logger.info(f"Enhanced dimensions: {enhanced.shape[1]}x{enhanced.shape[0]}")

        buf = io.BytesIO()
        Image.fromarray(enhanced).save(buf, format="PNG")
        buf.seek(0)
        logger.info("Enhancement complete")
        torch.cuda.empty_cache()
        return StreamingResponse(buf, media_type="image/png")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Enhancement failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")