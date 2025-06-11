/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileURL, setSelectedFileURL] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [denoise, setDenoise] = useState(true);
  const [upscale, setUpscale] = useState(true);
  const [showOriginalPreview, setShowOriginalPreview] = useState(false);
  const [showEnhancedPreview, setShowEnhancedPreview] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowOriginalPreview(false);
        setShowEnhancedPreview(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setEnhancedImage(null);
    setSelectedFileURL(URL.createObjectURL(file));
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
    setSelectedFile(file);
    setEnhancedImage(null);
    setSelectedFileURL(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setEnhancedImage(null);

    const formData = new FormData();
    formData.append("image", selectedFile);
    const params = new URLSearchParams({
      denoise: denoise.toString(),
      upscale: upscale.toString(),
    });

    try {
      const res = await fetch(
        `http://localhost:1000/api/enhance?${params.toString()}`,
        { method: "POST", body: formData }
      );
      if (!res.ok) throw new Error("Enhancement failed");

      const blob = await res.blob();
      setEnhancedImage(URL.createObjectURL(blob));
    } catch (err) {
      alert("Something went wrong: " + err.message);
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
      <div className="flex flex-col items-center justify-center pt-0 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Initial Upload Prompt */}
        {!selectedFileURL && !loading && !enhancedImage && (
          <motion.div
            className="text-center max-w-3xl w-full"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <motion.h1
              className="text-5xl font-extrabold text-gray-900 mt-20 mb-4 tracking-tight"
              variants={fadeInUp}
            >
              Make Your Images Shine
            </motion.h1>
            <motion.p
              className="text-xl text-gray-700 mb-10 leading-relaxed"
              variants={fadeInUp}
            >
              Enhance your photos effortlessly. Upload or drag and drop to
              start!
            </motion.p>
            <motion.div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-4 border-dashed border-gray-300 rounded-2xl p-12 bg-white shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              variants={fadeInUp}
            >
              <div className="flex flex-col items-center">
                <motion.svg
                  className="w-16 h-16 text-cyan-400 mb-4"
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
                <p className="text-lg text-gray-600 mb-3">
                  Drag & Drop your image here
                </p>
                <p className="text-sm text-gray-400 mb-6">or</p>
                <motion.label
                  htmlFor="file-upload"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-full cursor-pointer shadow-lg"
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

        {/* Preview + Enhance */}
        {selectedFileURL && !loading && !enhancedImage && (
          <motion.div
            className="text-center max-w-3xl w-full"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <motion.h1
              className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight"
              variants={fadeInUp}
            >
              Image Ready to Enhance
            </motion.h1>
            <motion.p
              className="text-xl text-gray-700 mb-10 leading-relaxed"
              variants={fadeInUp}
            >
              Your image is set! Click below to enhance it with AI-powered
              magic.
            </motion.p>
            <motion.div
              className="flex justify-center mb-8"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={selectedFileURL}
                alt="Selected Preview"
                className="w-64 h-64 object-cover rounded-2xl shadow-lg border-4 border-indigo-200"
              />
            </motion.div>
            <motion.button
              onClick={handleUpload}
              className="px-10 py-5 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-full text-xl font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={fadeInUp}
            >
              Enhance Image
            </motion.button>
          </motion.div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <motion.div
            className="flex flex-col items-center justify-center h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg
              className="animate-spin h-16 w-16 text-cyan-400 mb-6"
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
              className="text-xl text-gray-700 font-medium"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Enhancing your image... Please wait.
            </motion.p>
          </motion.div>
        )}

        {/* Display, Compare & Download */}
        {selectedFileURL && enhancedImage && !loading && (
          <motion.div
            className="w-full max-w-6xl mt-12"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-center mb-8">
              <motion.h2
                className="text-4xl font-bold text-gray-900 tracking-tight"
                variants={fadeInUp}
              >
                Compare Your Images
              </motion.h2>
              <div className="flex space-x-4">
                <motion.a
                  href={enhancedImage}
                  download="enhanced_image.png"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-full shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={fadeInUp}
                >
                  Download Enhanced
                </motion.a>
                <motion.button
                  onClick={handleTryAnother}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-full shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={fadeInUp}
                >
                  Try Another Image
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Before */}
              <motion.div
                className="relative w-full h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden"
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
                  className="absolute bottom-4 right-4 bg-violet-600/90 px-1 py-0 rounded-full shadow-lg text-white text-2xl"
                  whileHover={{ scale: 1.1, backgroundColor: "#5b21b6" }}
                >
                  <i className="ri-eye-line"></i>
                </motion.button>

                <div className="absolute top-4 left-4 text-white bg-violet-600/80 px-4 py-1 rounded-full text-sm font-medium">
                  Before
                </div>
              </motion.div>

              {/* After */}
              <motion.div
                className="relative w-full h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden"
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
                  className="absolute bottom-4 right-4 bg-violet-600/90 px-1 py-0 rounded-full shadow-lg text-white text-2xl"
                  whileHover={{ scale: 1.1, backgroundColor: "#5b21b6" }}
                >
                  <i className="ri-eye-line"></i>
                </motion.button>
                <div className="absolute top-4 right-4 text-white bg-violet-600/80 px-4 py-1 rounded-full text-sm font-medium">
                  After
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Modals */}
        {showOriginalPreview && selectedFileURL && (
          <motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div className="relative bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-auto">
              <motion.button
                onClick={() => setShowOriginalPreview(false)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:scale-110 transition"
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-close-line text-gray-700 text-2xl"></i>
              </motion.button>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Original Image
              </h3>
              <img
                src={selectedFileURL}
                alt="Original Preview"
                className="w-full max-w-[80vw] max-h-[80vh] object-contain rounded-xl shadow-lg mx-auto"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        )}

        {showEnhancedPreview && enhancedImage && (
          <motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div className="relative bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-auto">
              <motion.button
                onClick={() => setShowEnhancedPreview(false)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:scale-110 transition"
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-close-line text-gray-700 text-2xl"></i>
              </motion.button>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Enhanced Image
              </h3>
              <img
                src={enhancedImage}
                alt="Enhanced Preview"
                className="w-full max-w-[80vw] max-h-[90vh] object-contain rounded-xl shadow-lg mx-auto"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
