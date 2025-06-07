import React from 'react'

const About = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-blue-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-6">
          Our Story at <span className="text-blue-600">PixelPolish</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-12 leading-relaxed max-w-2xl mx-auto">
          Founded with a vision to democratize image enhancement, PixelPolish leverages cutting-edge AI to make professional-grade photo editing accessible to everyone. We believe that great visuals should be effortless, whether you’re a seasoned photographer or a casual user.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 text-center mb-10">What Drives Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Innovation</h3>
            <p className="text-gray-700">
              We harness the latest AI advancements to push the boundaries of image enhancement technology.
            </p>
          </div>
          <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Simplicity</h3>
            <p className="text-gray-700">
              Our tools are designed to be intuitive, delivering stunning results with just one click.
            </p>
          </div>
          <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Excellence</h3>
            <p className="text-gray-700">
              We strive for pixel-perfect quality in every photo, ensuring professional-grade outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About