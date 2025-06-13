import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleScroll = (e, sectionId) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className="bg-white/30 backdrop-blur-md sticky top-0 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-bold text-violet-700 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            PixelPolish
          </Link>

          {/* Hamburger Menu Button */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a
              href="#"
              onClick={(e) => handleScroll(e, 'top')}
              className="text-base sm:text-lg text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => handleScroll(e, 'about')}
              className="text-base sm:text-lg text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer"
            >
              About
            </a>
            <a
              href="#features"
              onClick={(e) => handleScroll(e, 'features')}
              className="text-base sm:text-lg text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer"
            >
              Features
            </a>
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, 'contact')}
              className="text-base sm:text-lg text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md py-4">
            <div className="flex flex-col space-y-4">
              <a
                href="#"
                onClick={(e) => handleScroll(e, 'top')}
                className="text-base text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer px-4 py-2"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={(e) => handleScroll(e, 'about')}
                className="text-base text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer px-4 py-2"
              >
                About
              </a>
              <a
                href="#features"
                onClick={(e) => handleScroll(e, 'features')}
                className="text-base text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer px-4 py-2"
              >
                Features
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, 'contact')}
                className="text-base text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer px-4 py-2"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;