# Use official Python slim image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Install torch and torchvision (CPU-only) with a compatible version
RUN pip install --no-cache-dir torch==1.13.1+cpu torchvision==0.14.1+cpu \
    -f https://download.pytorch.org/whl/cpu/torch_stable.html

# Copy requirements and install the rest
COPY requirements.txt .
# Remove torch lines to avoid reinstallation
RUN grep -vE 'torch|torchvision' requirements.txt > filtered-requirements.txt \
    && pip install --no-cache-dir -r filtered-requirements.txt

# Install uvicorn explicitly to ensure it's available
RUN pip install --no-cache-dir uvicorn

# Copy app code into the image
COPY . .

# Expose the port (Render's default)
EXPOSE 10000

# Run the FastAPI app with uvicorn
CMD ["uvicorn", "enhancer:app", "--host", "0.0.0.0", "--port", "10000"]