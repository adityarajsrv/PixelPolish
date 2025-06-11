import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useSpring } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import About from "./About";
import Features from "./Features";

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !message) {
      return;
    }

    setShowSuccessPopup(true);

    setEmail("");
    setMessage("");
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  return (
    <motion.div
      className="min-h-screen bg-white flex flex-col"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-violet-700 origin-left z-[100]"
        style={{ scaleX }}
      />
      <Navbar />
      {/* Hero Section */}
      <section
        id="#"
        className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-fuchsia-50 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="lg:w-1/2 p-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-violet-900 tracking-tight mb-6 leading-tight">
              Elevate Your Photos with{" "}
              <span className="text-violet-700">PixelPolish</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-800 mb-8 leading-relaxed max-w-md">
              Enhance images effortlessly using AI. Fix lighting, clean
              blemishes, and polish every detail — no skills needed.
            </p>
            <div className="flex space-x-4">
              <a
                href="/enhancer"
                className="inline-block bg-violet-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg text-lg hover:bg-violet-800 hover:scale-105 transition-transform"
              >
                Try It Now
              </a>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src="/assets/hero-img.jpg"
              alt="PixelPolish hero"
              className="w-full h-auto max-h-[480px] object-cover rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>
      {/* Sections */}
      <section id="about">
        <About />
      </section>
      <section id="features">
        <Features />
      </section>
      {/* Footer */}
      <footer
        id="contact"
        className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Branding */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-fuchsia-400">
              PixelPolish
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Enhance your photos effortlessly with smart, AI-driven tools. From
              raw to radiant in one click.
            </p>
            <p className="text-gray-500 text-xs">
              © 2025 PixelPolish. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-fuchsia-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-fuchsia-400 hover:underline transition"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-300 hover:text-fuchsia-400 hover:underline transition"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/enhancer"
                  className="text-gray-300 hover:text-fuchsia-400 hover:underline transition"
                >
                  Enhancer
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-fuchsia-400">
              Contact
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded-md bg-slate-800 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-fuchsia-400"
                required
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
                rows="3"
                className="w-full px-4 py-2 rounded-md bg-slate-800 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-fuchsia-400"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-violet-700 text-white px-4 py-2 rounded-md hover:bg-violet-800 hover:scale-105 transition-transform"
              >
                Send
              </button>
            </form>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-fuchsia-400">
              Follow Us
            </h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://twitter.com/pixelpolish"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-fuchsia-400 transition text-2xl"
              >
                <i className="ri-twitter-x-line"></i>
              </a>
              <a
                href="https://instagram.com/pixelpolish"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-fuchsia-400 transition text-2xl"
              >
                <i className="ri-instagram-line"></i>
              </a>
              <a
                href="https://linkedin.com/pixelpolish"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-fuchsia-400 transition text-2xl"
              >
                <i className="ri-linkedin-line"></i>
              </a>
            </div>
            <p className="text-gray-300 text-sm">
              Email:{" "}
              <a
                href="mailto:support@pixelpolish.com"
                className="hover:text-fuchsia-400 underline transition"
              >
                support@pixelpolish.com
              </a>
            </p>
            <p className="text-gray-300 text-sm">
              123 Photo Lane, Image City, 90210
            </p>
          </div>
        </div>
      </footer>
      {showSuccessPopup && (
        <div className="fixed bottom-5 right-5 bg-violet-700 text-white px-6 py-3 rounded-lg shadow-lg z-[200] animate-fade-in-out">
          Sent successfully!
        </div>
      )}
    </motion.div>
  );
};

export default Home;
