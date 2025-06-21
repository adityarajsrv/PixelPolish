/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import About from "./About";
import Features from "./Features";
import Footer from "./Footer";

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
  const navigate = useNavigate();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const sectionId = decodeURIComponent(location.hash.replace("#", ""));
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleTryNow = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/enhancer");
    }, 500);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999] transition-all duration-100">
          <div className="w-12 h-12 border-4 border-violet-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <motion.div
        className="min-h-screen bg-white flex flex-col"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          className="fixed top-0 left-0 right-0 h-2 bg-violet-700 origin-left z-[100]"
          style={{ scaleX }}
        />
        <Navbar />
        <section
          id="home"
          className="pt-12 pb-4 sm:pt-16 sm:pb-8 md:pt-20 md:pb-10 px-4 sm:px-6 md:px-8 lg:px-10 bg-gradient-to-r from-indigo-50 to-fuchsia-50 backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10">
            <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-violet-900 tracking-tight mb-4 sm:mb-6 leading-tight">
                Elevate Your Photos with{" "}
                <span className="text-violet-700">PixelPolish</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
                Enhance images effortlessly using AI. Fix lighting, clean
                blemishes, and polish every detail — no skills needed.
              </p>
              <div className="flex justify-center lg:justify-start space-x-4">
                <button
                  onClick={handleTryNow}
                  className="cursor-pointer inline-block bg-violet-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow-lg text-base sm:text-lg hover:bg-violet-800 hover:scale-105 transition-transform"
                >
                  Try It Now
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
              <img
                src="/assets/hero-img.jpg"
                alt="PixelPolish hero"
                loading="lazy"
                className="w-full h-auto max-h-[360px] sm:max-h-[420px] md:max-h-[480px] object-cover rounded-xl shadow-xl mx-auto"
              />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 mt-6">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-sm text-sm sm:text-base">
              <p>
                <strong>Note:</strong> Due to limitations on free-tier hosting
                services, real-time enhancement functionality is disabled in
                this deployment. However, you can{" "}
                <button
                  onClick={() => setShowVideoPopup(true)}
                  className="underline font-medium hover:text-yellow-700"
                >
                  watch a recorded demo
                </button>{" "}
                showcasing the full features of PixelPolish in action.
              </p>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="pt-0 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-r from-indigo-50 to-fuchsia-50"
        >
          <About />
        </section>

        <section
          id="features"
          className="pt-0 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-r from-indigo-50 to-fuchsia-50"
        >
          <Features />
        </section>

        <Footer
          setShowSuccessPopup={setShowSuccessPopup}
          handleTryNow={handleTryNow}
          className="bg-gradient-to-r from-indigo-50 to-fuchsia-50"
        />
      </motion.div>

      {showSuccessPopup && (
        <div className="fixed bottom-4 sm:bottom-5 right-4 sm:right-5 bg-violet-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg z-[200] transition-opacity duration-300 text-sm sm:text-base">
          Sent successfully!
        </div>
      )}

      {showVideoPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg overflow-hidden shadow-2xl max-w-3xl w-full relative">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setShowVideoPopup(false)}
                className="text-gray-600 hover:text-black text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-[400px] sm:h-[500px]"
                src="https://www.youtube.com/embed/kbG8f5KqmBc"
                title="PixelPolish Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
