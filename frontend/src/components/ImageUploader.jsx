/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Cropper from "react-cropper";
import "../assets/cropper.css";
import Navbar from "./Navbar";
import jsPDF from "jspdf";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_WIDTH = 2048;
const MAX_HEIGHT = 2048;

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileURL, setSelectedFileURL] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [denoise, setDenoise] = useState(true);
  const [upscale, setUpscale] = useState(true);
  const [showOriginalPreview, setShowOriginalPreview] = useState(false);
  const [showEnhancedPreview, setShowEnhancedPreview] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resizeWarning, setResizeWarning] = useState("");
  const [originalDimensions, setOriginalDimensions] = useState(null);
  const [enhancedDimensions, setEnhancedDimensions] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showCropper, setShowCropper] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [downloadFormat, setDownloadFormat] = useState("png");
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const canvasRef = useRef(null);
  const cropperRef = useRef(null);
  const editedImageRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowOriginalPreview(false);
        setShowEnhancedPreview(false);
        setShowSizeError(false);
        setErrorMessage("");
        setResizeWarning("");
        setShowCropper(false);
        setNotification({ show: false, type: "", message: "" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: "", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    if (!selectedFileURL || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = selectedFileURL;

    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width *= ratio;
        height *= ratio;
      }
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();

      editedImageRef.current = canvas.toDataURL("image/png");
    };
    img.onerror = () => {
      setErrorMessage("Failed to load image for editing.");
    };
  }, [selectedFileURL, rotation, brightness, contrast]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setShowSizeError(true);
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
        setResizeWarning(
          `Image dimensions (${img.width}x${img.height}) exceed 2048x2048 and will be resized.`
        );
      }
      setSelectedFile(file);
      setEnhancedImage(null);
      setSelectedFileURL(URL.createObjectURL(file));
      setRotation(0);
      setBrightness(100);
      setContrast(100);
      setShowCropper(false);
    };
    img.onerror = () => {
      setErrorMessage("Failed to load image.");
    };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.add(
      "border-fuchsia-500",
      "bg-indigo-50",
      "scale-105"
    );
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.remove(
      "border-fuchsia-500",
      "bg-indigo-50",
      "scale-105"
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.remove(
      "border-fuchsia-500",
      "bg-indigo-50",
      "scale-105"
    );
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setShowSizeError(true);
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
        setResizeWarning(
          `Image dimensions (${img.width}x${img.height}) exceed 2048x2048 and will be resized.`
        );
      }
      setSelectedFile(file);
      setEnhancedImage(null);
      setSelectedFileURL(URL.createObjectURL(file));
      setRotation(0);
      setBrightness(100);
      setContrast(100);
      setShowCropper(false);
    };
    img.onerror = () => {
      setErrorMessage("Failed to load image.");
    };
  };

  const applyEdits = () => {
    if (!editedImageRef.current) {
      setErrorMessage("No edited image available.");
      return;
    }
    fetch(editedImageRef.current)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "edited_image.png", {
          type: "image/png",
        });
        setSelectedFile(file);
        setSelectedFileURL(editedImageRef.current);
        setNotification({
          show: true,
          type: "success",
          message: "Edits applied successfully!",
        });
      })
      .catch(() => {
        setErrorMessage("Failed to apply edits.");
      });
  };

  const initiateCrop = () => {
    setShowCropper(true);
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const croppedCanvas = cropper.getCroppedCanvas();
      if (!croppedCanvas) {
        setErrorMessage("Failed to crop image.");
        return;
      }
      const croppedImage = croppedCanvas.toDataURL("image/png");
      fetch(croppedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "cropped_image.png", {
            type: "image/png",
          });
          setSelectedFile(file);
          setSelectedFileURL(croppedImage);
          setShowCropper(false);
          setNotification({
            show: true,
            type: "success",
            message: "Image cropped successfully!",
          });
        })
        .catch(() => {
          setErrorMessage("Failed to apply crop.");
        });
    }
  };

  const resetEdits = () => {
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSelectedFileURL(URL.createObjectURL(selectedFile));
    setShowCropper(false);
    setNotification({
      show: true,
      type: "info",
      message: "Edits reset to original image.",
    });
  };

  const handleChangeImage = () => {
    setSelectedFile(null);
    setSelectedFileURL(null);
    setOriginalDimensions(null);
    setResizeWarning("");
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setShowCropper(false);
    setNotification({
      show: true,
      type: "info",
      message: "Ready to upload a new image.",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("No image selected for enhancement.");
      return;
    }
    setLoading(true);
    setEnhancedImage(null);
    setErrorMessage("");
    setEnhancedDimensions(null);

    const formData = new FormData();
    formData.append("image", selectedFile);
    const params = new URLSearchParams({
      denoise: denoise.toString(),
      upscale: upscale.toString(),
      resize: "true",
    });

    try {
      const res = await fetch(`http://localhost:1000/api/enhance?${params.toString()}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Enhancement failed");
      }

      const dimensionsHeader = res.headers.get("X-Enhanced-Dimensions");
      if (dimensionsHeader) {
        const [width, height] = dimensionsHeader.split("x").map(Number);
        setEnhancedDimensions({ width, height });
      }

      const blob = await res.blob();
      setEnhancedImage(URL.createObjectURL(blob));
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTryAnother = () => window.location.reload();

  const handleDownload = () => {
    if (!enhancedImage) {
      setErrorMessage("No enhanced image available for download.");
      return;
    }

    const img = new Image();
    img.src = enhancedImage;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      if (downloadFormat === "pdf") {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? "landscape" : "portrait",
          unit: "px",
          format: [img.width, img.height],
        });
        pdf.addImage(enhancedImage, "PNG", 0, 0, img.width, img.height);
        pdf.save("enhanced_image.pdf");
        setNotification({
          show: true,
          type: "success",
          message: "PDF downloaded successfully!",
        });
      } else {
        const mimeType = downloadFormat === "jpeg" ? "image/jpeg" : "image/png";
        const extension = downloadFormat === "jpeg" ? "jpg" : "png";
        const dataUrl = canvas.toDataURL(
          mimeType,
          downloadFormat === "jpeg" ? 0.9 : 1.0
        );
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `enhanced_image.${extension}`;
        link.click();
        setNotification({
          show: true,
          type: "success",
          message: `${downloadFormat.toUpperCase()} downloaded successfully!`,
        });
      }
    };
    img.onerror = () => {
      setErrorMessage("Failed to load enhanced image for download.");
    };
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-0 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8 lg:px-10">
        {notification.show && (
          <motion.div
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 ${
              notification.type === "success" ? "bg-green-500" : "bg-blue-500"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center">
              <span>{notification.message}</span>
              <button
                onClick={() =>
                  setNotification({ show: false, type: "", message: "" })
                }
                className="ml-4 text-white hover:text-gray-200"
                aria-label="Close notification"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </motion.div>
        )}

        {!selectedFileURL && !loading && !enhancedImage && (
          <motion.div
            className="text-center max-w-3xl w-full"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-12 sm:mt-16 md:mt-20 mb-3 sm:mb-4 tracking-tight"
              variants={fadeInUp}
            >
              Make Your Images Shine
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 md:mb-10 leading-relaxed"
              variants={fadeInUp}
            >
              Enhance your photos effortlessly. Upload or drag and drop to
              start! (Max size: 10MB, Max dimensions: 2048x2048)
            </motion.p>
            <motion.div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-4 border-dashed border-gray-300 rounded-2xl p-6 sm:p-8 md:p-12 bg-white shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              variants={fadeInUp}
            >
              <div className="flex flex-col items-center">
                <motion.svg
                  className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 mb-3 sm:mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </motion.svg>
                <p className="text-base sm:text-lg text-gray-600 mb-2 sm:mb-3">
                  Drag & Drop your image here
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                  or
                </p>
                <motion.label
                  htmlFor="file-upload"
                  className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-full cursor-pointer shadow-lg text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Upload Image
                </motion.label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedFileURL && !loading && !enhancedImage && (
          <motion.div
            className="text-center max-w-3xl w-full"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <motion.h1
              className="text-3xl mt-4 sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight"
              variants={fadeInUp}
            >
              Image Ready to Enhance
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 md:mb-10 leading-relaxed"
              variants={fadeInUp}
            >
              Your image is set! Edit it below or click to enhance with
              AI-powered magic.
            </motion.p>
            {resizeWarning && (
              <motion.p
                className="text-sm sm:text-base text-yellow-600 bg-yellow-100 p-3 rounded-lg mb-4"
                variants={fadeInUp}
              >
                {resizeWarning}
              </motion.p>
            )}
            <motion.div
              className="flex justify-center mb-6 sm:mb-8"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <canvas
                ref={canvasRef}
                className="max-w-[80vw] max-h-[60vh] sm:max-w-[600px] sm:max-h-[400px] object-contain rounded-2xl shadow-lg border-4 border-indigo-200"
              />
            </motion.div>
            {/* Editing Tools Panel */}
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mb-6"
              variants={fadeInUp}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Edit Image
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rotation */}
                <div>
                  <label
                    className="block text-sm sm:text-base text-gray-700 mb-2"
                    htmlFor="rotation"
                  >
                    Rotation: {rotation}°
                  </label>
                  <input
                    id="rotation"
                    type="range"
                    min="-180"
                    max="180"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full"
                    aria-label="Adjust rotation"
                  />
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => setRotation((prev) => (prev - 90) % 360)}
                      className="px-3 py-1 bg-violet-600 text-white rounded-full text-sm"
                    >
                      -90°
                    </button>
                    <button
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="px-3 py-1 bg-violet-600 text-white rounded-full text-sm"
                    >
                      +90°
                    </button>
                  </div>
                </div>
                {/* Brightness */}
                <div>
                  <label
                    className="block text-sm sm:text-base text-gray-700 mb-2"
                    htmlFor="brightness"
                  >
                    Brightness: {brightness}%
                  </label>
                  <input
                    id="brightness"
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full"
                    aria-label="Adjust brightness"
                  />
                </div>
                {/* Contrast */}
                <div>
                  <label
                    className="block text-sm sm:text-base text-gray-700 mb-2"
                    htmlFor="contrast"
                  >
                    Contrast: {contrast}%
                  </label>
                  <input
                    id="contrast"
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full"
                    aria-label="Adjust contrast"
                  />
                </div>
                {/* Crop */}
                <div>
                  <label className="block text-sm sm:text-base text-gray-700 mb-2">
                    Crop
                  </label>
                  <button
                    onClick={initiateCrop}
                    className="px-3 py-1 bg-violet-600 text-white rounded-full text-sm"
                    aria-label="Initiate cropping"
                  >
                    Select Crop Area
                  </button>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={applyEdits}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-full shadow-md text-sm sm:text-base"
                >
                  Apply Edits
                </button>
                <button
                  onClick={resetEdits}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md text-sm sm:text-base"
                >
                  Reset Edits
                </button>
              </div>
            </motion.div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <motion.button
                onClick={handleUpload}
                className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-full text-base sm:text-xl font-semibold shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={fadeInUp}
              >
                Enhance Image
              </motion.button>
              <motion.button
                onClick={handleChangeImage}
                className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full text-base sm:text-xl font-semibold shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={fadeInUp}
              >
                Change Image
              </motion.button>
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div
            className="flex flex-col items-center justify-center h-64 sm:h-80 md:h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg
              className="animate-spin h-12 w-12 sm:h-16 sm:w-16 text-cyan-400 mb-4 sm:mb-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 font-medium"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Enhancing your image... Please wait.
            </motion.p>
          </motion.div>
        )}

        {selectedFileURL && enhancedImage && !loading && (
          <motion.div
            className="w-full max-w-6xl mt-8 sm:mt-10 md:mt-12"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-0"
                variants={fadeInUp}
              >
                Compare Your Images
              </motion.h2>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
                <motion.div className="flex items-center" variants={fadeInUp}>
                  <select
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-full shadow-md text-sm sm:text-base focus:outline-none"
                    aria-label="Select download format"
                  >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="pdf">PDF</option>
                  </select>
                </motion.div>
                <motion.button
                  onClick={handleDownload}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-full shadow-md text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={fadeInUp}
                >
                  Download Enhanced
                </motion.button>
                <motion.button
                  onClick={handleTryAnother}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-full shadow-md text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={fadeInUp}
                >
                  Try Another Image
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <motion.div
                className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={selectedFileURL}
                  alt="Before"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
                <motion.button
                  onClick={() => setShowOriginalPreview(true)}
                  className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-violet-600/90 px-1 py-0 rounded-full shadow-lg text-white text-xl sm:text-2xl"
                  whileHover={{ scale: 1.1, backgroundColor: "#5b21b6" }}
                >
                  <i className="ri-eye-line"></i>
                </motion.button>
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 text-white bg-violet-600/80 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                  Before
                </div>
              </motion.div>

              <motion.div
                className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={enhancedImage}
                  alt="After"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
                <motion.button
                  onClick={() => setShowEnhancedPreview(true)}
                  className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-violet-600/90 px-1 py-0 rounded-full shadow-lg text-white text-xl sm:text-2xl"
                  whileHover={{ scale: 1.1, backgroundColor: "#5b21b6" }}
                >
                  <i className="ri-eye-line"></i>
                </motion.button>
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white bg-violet-600/80 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                  After
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {showOriginalPreview && selectedFileURL && (
          <motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div className="relative bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-[90vw] w-full mx-2 sm:mx-4 max-h-[90vh] overflow-auto">
              <motion.button
                onClick={() => setShowOriginalPreview(false)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white border border-black p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-100"
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-close-line text-gray-700 text-xl sm:text-2xl"></i>
              </motion.button>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Original Image
              </h3>
              <img
                src={selectedFileURL}
                alt="Original Preview"
                className="w-full max-w-[80vw] max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg shadow-lg mx-auto"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        )}

        {showEnhancedPreview && enhancedImage && (
          <motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div className="relative bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-[90vw] w-full mx-2 sm:mx-4 max-h-[90vh] overflow-auto">
              <motion.button
                onClick={() => setShowEnhancedPreview(false)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white border border-black p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-100"
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-close-line text-gray-700 text-xl sm:text-2xl"></i>
              </motion.button>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Enhanced Image
              </h3>
              <img
                src={enhancedImage}
                alt="Enhanced Preview"
                className="w-full max-w-[80vw] max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg shadow-lg mx-auto"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        )}

        {showSizeError && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-[30vw] w-full mx-2 sm:mx-4 max-h-[90vh] overflow-auto text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <motion.button
                onClick={() => setShowSizeError(false)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white border border-black p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-100"
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-close-line text-red-700 text-xl sm:text-2xl"></i>
              </motion.button>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                Image Size Too Large
              </h3>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                The selected image exceeds the maximum size limit of 10MB.
                Please try uploading a smaller image.
              </p>
              <motion.button
                onClick={() => setShowSizeError(false)}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-full shadow-lg text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-[90vw] w-full mx-2 sm:mx-4 max-h-[90vh] overflow-auto text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <motion.button
                onClick={() => setErrorMessage("")}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white border border-black p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-100"
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-close-line text-red-700 text-xl sm:text-2xl"></i>
              </motion.button>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                Error
              </h3>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                {errorMessage}
              </p>
              <motion.button
                onClick={() => setErrorMessage("")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-full shadow-lg text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {resizeWarning && !loading && !enhancedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-[30vw] w-full mx-2 sm:mx-4 max-h-[90vh] overflow-auto text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <motion.button
                onClick={() => setResizeWarning("")}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white border border-black p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-100"
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-close-line text-yellow-700 text-xl sm:text-2xl"></i>
              </motion.button>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                Resize Warning
              </h3>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                {resizeWarning}
              </p>
              <motion.button
                onClick={() => setResizeWarning("")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-full shadow-lg text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {showCropper && selectedFileURL && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white rounded-2xl p-4 sm:p-6 max-w-[90vw] max-h-[90vh] overflow-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <motion.button
                onClick={() => setShowCropper(false)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white border border-black p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-100"
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-close-line text-gray-700 text-xl sm:text-2xl"></i>
              </motion.button>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Crop Image
              </h3>
              <Cropper
                src={selectedFileURL}
                style={{ height: 400, width: 400 }}
                aspectRatio={NaN}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                dragMode="move"
                cropBoxMovable={true}
                cropBoxResizable={true}
              />
              <div className="flex justify-center mt-4">
                <motion.button
                  onClick={handleCrop}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-full shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply Crop
                </motion.button>
                <motion.button
                  onClick={() => setShowCropper(false)}
                  className="ml-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
