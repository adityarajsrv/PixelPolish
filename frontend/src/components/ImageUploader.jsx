/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setEnhancedImage(null);
    setSelectedFileURL(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.add("border-indigo-500", "bg-indigo-50", "scale-105");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.remove("border-indigo-500", "bg-indigo-50", "scale-105");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.remove("border-indigo-500", "bg-indigo-50", "scale-105");
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
      const res = await fetch(`http://localhost:1000/api/enhance?${params.toString()}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Enhancement failed");

      const blob = await res.blob();
      const imageURL = URL.createObjectURL(blob);
      setEnhancedImage(imageURL);
    } catch (err) {
      alert("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTryAnother = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
      <Navbar />

      <div className="flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {!selectedFileURL && !loading && !enhancedImage && (
          <div className="text-center max-w-3xl w-full animate-fade-in">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Make Your Images Shine
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Enhance your photos effortlessly. Upload or drag and drop to start!
            </p>
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-4 border-dashed border-gray-300 rounded-2xl p-12 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform"
            >
              <div className="flex flex-col items-center">
                <svg
                  className="w-16 h-16 text-indigo-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-lg text-gray-500 mb-3">Drag & Drop your image here</p>
                <p className="text-sm text-gray-400 mb-6">or</p>
                <label
                  htmlFor="file-upload"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full cursor-pointer hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Upload Image
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        )}

        {selectedFileURL && !loading && !enhancedImage && (
          <div className="text-center max-w-3xl w-full animate-fade-in">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Image Ready to Enhance
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Your image is set! Click below to enhance it with AI-powered technology.
            </p>
            <div className="flex justify-center mb-8">
              <img
                src={selectedFileURL}
                alt="Selected Preview"
                className="w-64 h-64 object-cover rounded-2xl shadow-lg border-4 border-indigo-200"
              />
            </div>
            <button
              onClick={handleUpload}
              className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 text-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Enhance Image
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
            <svg
              className="animate-spin h-16 w-16 text-indigo-600 mb-6"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="text-xl text-gray-700 font-medium animate-pulse">
              Enhancing your image... Please wait.
            </p>
          </div>
        )}

        {selectedFileURL && enhancedImage && !loading && (
          <div className="w-full max-w-6xl mt-12 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Compare Your Images</h2>
              <div className="flex space-x-4">
                <a
                  href={enhancedImage}
                  download="enhanced_image.png"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Download Enhanced
                </a>
                <button
                  onClick={handleTryAnother}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Try Another Image
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative w-full h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={selectedFileURL}
                  alt="Before"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
                <button
                  onClick={() => setShowOriginalPreview(true)}
                  className="absolute bottom-4 right-4 bg-indigo-500/90 p-4 rounded-full shadow-lg hover:bg-indigo-600 transition-all duration-300 group"
                  title="Preview Original Image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <div className="absolute top-4 left-4 text-white bg-indigo-500/80 px-4 py-1 rounded-full text-sm font-medium">
                  Before
                </div>
              </div>

              <div className="relative w-full h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={enhancedImage}
                  alt="After"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
                <button
                  onClick={() => setShowEnhancedPreview(true)}
                  className="absolute bottom-4 right-4 bg-indigo-500/90 p-4 rounded-full shadow-lg hover:bg-indigo-600 transition-all duration-300 group"
                  title="Preview Enhanced Image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <div className="absolute top-4 right-4 text-white bg-indigo-500/80 px-4 py-1 rounded-full text-sm font-medium">
                  After
                </div>
              </div>
            </div>
          </div>
        )}

        {showOriginalPreview && selectedFileURL && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
            <div className="relative bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 shadow-2xl">
              <button
                onClick={() => setShowOriginalPreview(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors duration-300 transform hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Original Image</h3>
              <img
                src={selectedFileURL}
                alt="Original Preview"
                className="w-full rounded-xl shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {showEnhancedPreview && enhancedImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
            <div className="relative bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 shadow-2xl">
              <button
                onClick={() => setShowEnhancedPreview(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors duration-300 transform hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Enhanced Image</h3>
              <img
                src={enhancedImage}
                alt="Enhanced Preview"
                className="w-full rounded-xl shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;