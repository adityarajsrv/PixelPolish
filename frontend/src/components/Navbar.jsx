import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-blue-100 bg-opacity-20 backdrop-blur-md p-4 sticky top-0 z-50">
      <h1 className="text-3xl font-bold text-blue-500 cursor-pointer ml-6">PixelPolish</h1>
      <div className="flex items-center space-x-8">
        <a href="/" className="text-blue-500 hover:text-blue-800 transition-colors duration-300 font-medium">
          Home
        </a>
        <a href="/about" className="text-blue-500 hover:text-blue-800 transition-colors duration-300 font-medium">
          About
        </a>
        <a href="/features" className="text-blue-500 hover:text-blue-800 transition-colors duration-300 font-medium">
          Features
        </a>
        <a href="/contact" className="text-blue-500 hover:text-blue-800 transition-colors duration-300 font-medium">
          Contact
        </a>
      </div>
    </nav>
  )
}

export default Navbar