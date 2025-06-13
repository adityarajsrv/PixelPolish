import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Footer = ({ setShowSuccessPopup, handleTryNow }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !message) {
      alert("Please fill in both fields.");
      return;
    }

    const templateParams = {
      name: email.split("@")[0],
      email,
      message,
      time: new Date().toLocaleString(),
      title: "New Contact Form Message",
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setShowSuccessPopup(true);
          setEmail("");
          setMessage("");
          setTimeout(() => setShowSuccessPopup(false), 2000);
        },
        (error) => {
          console.error("FAILED...", error);
          alert("Something went wrong. Please try again.");
        }
      );
  };

  return (
    <footer
      id="contact"
      className="bg-slate-900 text-white py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 lg:px-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-fuchsia-400">
            PixelPolish
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
            Enhance your photos effortlessly with smart, AI-driven tools. From
            raw to radiant in one click.
          </p>
          <p className="text-gray-500 text-xs">
            © 2025 PixelPolish. All rights reserved.
          </p>
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-fuchsia-400">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm">
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
              <span
                onClick={handleTryNow}
                className="cursor-pointer text-gray-300 hover:text-fuchsia-400 hover:underline transition"
              >
                Enhancer
              </span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-fuchsia-400">
            Contact
          </h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              name="email"
              aria-label="Your Email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md bg-slate-800 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-fuchsia-400"
              required
            />
            <textarea
              name="message"
              aria-label="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              rows="3"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md bg-slate-800 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-fuchsia-400"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-violet-700 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-violet-800 hover:scale-105 transition-transform"
            >
              Send
            </button>
          </form>
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-fuchsia-400">
            Follow Us
          </h4>
          <div className="flex space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <a
              href="https://twitter.com/pixelpolish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-fuchsia-400 transition text-xl sm:text-2xl"
            >
              <i className="ri-twitter-x-line"></i>
            </a>
            <a
              href="https://instagram.com/pixelpolish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-fuchsia-400 transition text-xl sm:text-2xl"
            >
              <i className="ri-instagram-line"></i>
            </a>
            <a
              href="https://linkedin.com/pixelpolish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-fuchsia-400 transition text-xl sm:text-2xl"
            >
              <i className="ri-linkedin-line"></i>
            </a>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm mb-2">
            Email:{" "}
            <a
              href="mailto:support@pixelpolish.com"
              className="hover:text-fuchsia-400 underline transition"
            >
              support@pixelpolish.com
            </a>
          </p>
          <p className="text-gray-300 text-xs sm:text-sm">
            123 Photo Lane, Image City, 90210
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
