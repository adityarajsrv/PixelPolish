import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const handleScroll = (e, sectionId) => {
    e.preventDefault();

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
    <nav className="flex items-center justify-between bg-white/30 backdrop-blur-md p-4 sticky top-0 z-50 shadow-md">
      <Link to="/" className="text-3xl font-bold text-violet-700 cursor-pointer ml-6">
        PixelPolish
      </Link>

      <div className="flex items-center space-x-8 mr-6">
        <a
          href="#"
          onClick={(e) => handleScroll(e, 'top')}
          className="text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer"
        >
          Home
        </a>
        <a
          href="#about"
          onClick={(e) => handleScroll(e, 'about')}
          className="text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer"
        >
          About
        </a>
        <a
          href="#features"
          onClick={(e) => handleScroll(e, 'features')}
          className="text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer"
        >
          Features
        </a>
        <a
          href="#contact"
          onClick={(e) => handleScroll(e, 'contact')}
          className="text-gray-800 hover:text-fuchsia-500 transition-colors duration-300 font-medium cursor-pointer"
        >
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
