from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
import numpy as np
import cv2

from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer
from dncnn_model import load_dncnn_model, DnCNN

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cuda" if torch.cuda.is_available() else "cpu"

def load_realesrgan():
    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
    upscaler = RealESRGANer(
        scale=4,
        model_path="weights/RealESRGAN_x4plus.pth",
        model=model,
        tile=128,
        tile_pad=10,
        pre_pad=0,
        half=torch.cuda.is_available(),
        device=device
    )
    return upscaler

def load_dncnn():
    weights_path = "weights/dncnn_rgb.pth"
    print(f"Loading DnCNN model from: {weights_path}")
    model = load_dncnn_model(weights_path, device)
    return model

upscaler = load_realesrgan()
dncnn_model = load_dncnn()

# Load Haar cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def denoise_image_preserve_faces(pil_image, blend_ratio=0.3):
    orig_np = np.array(pil_image).astype(np.uint8)
    img = orig_np.astype(np.float32) / 255.0
    img_t = torch.from_numpy(img).permute(2, 0, 1).unsqueeze(0).to(device)

    with torch.no_grad():
        denoised = dncnn_model(img_t).clamp(0, 1)
    denoised_np = denoised.squeeze(0).permute(1, 2, 0).cpu().numpy()
    denoised_img = (denoised_np * 255).astype(np.uint8)

    # Detect faces in the original image
    gray = cv2.cvtColor(orig_np, cv2.COLOR_RGB2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4)

    for (x, y, w, h) in faces:
        face_orig = orig_np[y:y+h, x:x+w]
        face_denoised = denoised_img[y:y+h, x:x+w]

        # Blend: 70% original + 30% denoised
        blended_face = cv2.addWeighted(face_orig, 1 - blend_ratio, face_denoised, blend_ratio, 0)
        denoised_img[y:y+h, x:x+w] = blended_face

    return Image.fromarray(denoised_img)

@app.get("/")
async def root():
    return {"message": "Image Enhancer API is running!"}

@app.post("/api/enhance")
async def enhance_image_api(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")

        denoised_img = denoise_image_preserve_faces(pil_image)

        img_np = np.array(denoised_img)
        enhanced, _ = upscaler.enhance(img_np, outscale=4)

        enhanced_pil = Image.fromarray(enhanced)
        buf = io.BytesIO()
        enhanced_pil.save(buf, format="PNG")
        buf.seek(0)

        return StreamingResponse(buf, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")
