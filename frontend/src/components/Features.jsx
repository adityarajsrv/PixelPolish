import React from 'react'

const Features = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-blue-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 text-center mb-8">
          Powerful Features of <span className="text-blue-600">PixelPolish</span>
        </h2>
        <p className="text-lg text-gray-700 text-center mb-10 max-w-2xl mx-auto">
          Elevate your photos with tools designed for simplicity and professional results.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">AI-Powered Enhancement</h3>
            <p className="text-gray-700">
              Automatically adjust lighting, sharpness, and colors to make your photos look professional in seconds.
            </p>
          </div>
          <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">One-Click Editing</h3>
            <p className="text-gray-700">
              No experience needed—enhance your images with a single click using our intuitive tools.
            </p>
          </div>
          <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Avatar Creation</h3>
            <p className="text-gray-700">
              Turn your photos into personalized avatars with AI-driven styles and effects.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features