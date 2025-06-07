import React from 'react'
// import ImageUpload from './ImageUpload'
// import ImagePreview from './ImagePreview'
import Navbar from './Navbar'
import About from './About'
import Features from './Features'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-blue-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2 p-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-900 tracking-tight mb-6 leading-tight">
              Enhance Photos Instantly with <span className="text-blue-600">PixelPolish</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-md">
              Automatically fix lighting, remove imperfections, and give your photos a professional touch—all with one simple click. No editing experience required.
            </p>
            <div className="flex space-x-4">
              <a
                href="/enhancer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 
                transition-colors duration-300 font-semibold shadow-md text-lg"
              >
                Try It Now
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <img
              src="/assets/hero-img.jpg" 
              alt="PixelPolish hero image"
              className="w-full h-auto max-h-[480px] object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>
      <section id="about">
        <About />
      </section>
      <section id="features">
        <Features />
      </section>
      <footer className="bg-gradient-to-r from-blue-100 to-blue-50 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 bg-white bg-opacity-90 backdrop-blur-md py-4 shadow-md">
          <p className="text-gray-700 text-sm">
            © 2025 PixelPolish. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com/pixelpolish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors duration-300 text-sm"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com/pixelpolish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors duration-300 text-sm"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com/company/pixelpolish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors duration-300 text-sm"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home