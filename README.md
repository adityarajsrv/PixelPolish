# PixelPolish — Image Enhancer

PixelPolish is a full-stack, AI-powered image enhancement web application. It empowers users to upload low-quality or noisy images and receive high-quality, professionally enhanced versions. With cutting-edge deep learning models, the platform offers intuitive, fast, and responsive tools that bring studio-level image upscaling and denoising to everyone.

## Purpose & Vision

PixelPolish aims to make professional image enhancement accessible to everyone via a clean and responsive web interface. Using deep learning models like Real-ESRGAN and DnCNN-B, it allows users to upscale and denoise images with minimal effort.

## Core Features

### 1. Image Upload
- Drag & drop or file picker
- Preview before enhancement
- JPEG, PNG, and other common formats supported

### 2. AI-Powered Enhancement
- **Super-resolution** via **Real-ESRGAN**
- **Denoising** using custom-trained **DnCNN-B**
- Python subprocess handles deep learning inference via Node.js

### 3. Real-Time Feedback
- Loading indicators during enhancement
- Side-by-side before/after comparison
- Instant download or preview of result

### 4. Responsive Design
- Built with Tailwind CSS
- Fully mobile-friendly layout
- Components adapt to screen size seamlessly

### 5. Image Optimization
- EXIF orientation correction
- Automatic format handling (JPG/PNG)
- Fallback for upload or enhancement errors

## AI Models

### 🔹 Real-ESRGAN
- **File:** RealESRGAN_x4plus.pth
- **Purpose:** Super-resolution (4x image upscaling)
- **Framework:** PyTorch

### 🔹 DnCNN-B (Custom Trained)
- **File:** dncnn_rgb.pth
- **Purpose:** Denoising with color retention
- **Training Details:**
  - Dataset: ImageNet with noise augmentation
  - Loss Function: MSE
  - Optimizer: Adam
  - Framework: PyTorch


## Tech Stack

### Backend
- **Node.js** with **Express.js** for API and Python integration
- **Python** for running enhancement models
- **child_process.execFile** to bridge Node ↔ Python
- **Pillow**, **OpenCV**, **torch** for image and model processing
- **Multer**, **fs** for upload and file handling

### Frontend
- **React.js** with **Tailwind CSS** for sleek UI
- **Framer Motion** for animations
- **React Router** for navigation

## Flow of Operation

1. User uploads image
2. Frontend sends file to backend
3. Node server stores the image and runs enhancer.py
4. enhancer.py calls:
   - Real-ESRGAN for upscaling
   - DnCNN for denoising
5. Enhanced image is returned to frontend
6. User previews & downloads result

## 🌐 Connect

🌟 Star this repo to support the project
🔗 LinkedIn: [https://www.linkedin.com/in/adityarajsrv/](https://www.linkedin.com/in/adityarajsrv/)

