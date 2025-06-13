/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

// Maximum file size in bytes (10 MB = 10 * 1024 * 1024 bytes)
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
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowOriginalPreview(false);
        setShowEnhancedPreview(false);
        setShowSizeError(false);
        setErrorMessage("");
        setResizeWarning("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setShowSizeError(true);
      return;
    }

    // Check dimensions
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

    // Check dimensions
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
    };
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
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
      const res = await fetch(
        `http://localhost:1000/api/enhance?${params.toString()}`,
        { method: "POST", body: formData }
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-0 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8 lg:px-10">
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
                <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">or</p>
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
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight"
              variants={fadeInUp}
            >
              Image Ready to Enhance
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 md:mb-10 leading-relaxed"
              variants={fadeInUp}
            >
              Your image is set! Click below to enhance it with AI-powered
              magic.
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
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={selectedFileURL}
                alt="Selected Preview"
                className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-2xl shadow-lg border-4 border-indigo-200"
              />
            </motion.div>
            <motion.button
              onClick={handleUpload}
              className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-full text-base sm:text-xl font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={fadeInUp}
            >
              Enhance Image
            </motion.button>
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
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.a
                  href={enhancedImage}
                  download="enhanced_image.png"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-full shadow-md text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={fadeInUp}
                >
                  Download Enhanced
                </motion.a>
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
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white border border-black p-1 sm:p-2 rounded-full shadow hover:scale-110 transition"
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
                className="w-full max-w-[80vw] max-h-[70vh] sm:max-h-[80vh] object-contain rounded-xl shadow-lg mx-auto"
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
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white border border-black p-1 sm:p-2 rounded-full shadow hover:scale-110 transition"
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
                className="w-full max-w-[80vw] max-h-[70vh] sm:max-h-[80vh] object-contain rounded-xl shadow-lg mx-auto"
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
              className="relative bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-[90vw] w-full mx-2 sm:mx-4 max-h-[90vh] overflow-auto text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <motion.button
                onClick={() => setShowSizeError(false)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white border border-black p-1 sm:p-2 rounded-full shadow hover:scale-110 transition"
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-close-line text-red-700 text-xl sm:text-2xl"></i>
              </motion.button>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                Image Size Too Large
              </h3>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                The selected image exceeds the maximum size limit of 10MB. Please try uploading a smaller image.
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
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white border border-black p-1 sm:p-2 rounded-full shadow hover:scale-110 transition"
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
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white border border-black p-1 sm:p-2 rounded-full shadow hover:scale-110 transition"
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
      </div>
    </div>
  );
};

export default ImageUploader;