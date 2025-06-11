import React from 'react';

const About = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-fuchsia-50 backdrop-blur-md">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-violet-900 mb-6">
          Our Story at <span className="text-violet-700">PixelPolish</span>
        </h1>
        <p className="text-lg text-gray-800 mb-12 leading-relaxed">
          Founded with a vision to democratize image enhancement, PixelPolish leverages cutting-edge AI to make professional-grade photo editing accessible to everyone. Built on the principle that high-quality visuals should not require technical expertise or expensive tools, PixelPolish combines intuitive design with powerful algorithms to deliver stunning results in seconds. Whether for personal memories, creative projects, or professional content, PixelPolish empowers users to achieve polished, impactful imagery with minimal effort.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-violet-900 text-center mb-10">
          What Drives Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Innovation', text: 'Harnessing the latest advancements in AI to push the boundaries of what’s possible in image enhancement.' },
            { title: 'Simplicity', text: 'Designing intuitive tools that transform complex editing into one-click simplicity, delivering stunning results with ease.' },
            { title: 'Excellence', text: 'Pursuing pixel-perfect quality in every photo, ensuring professional-grade outcomes across all types of visuals.' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-xl font-semibold text-fuchsia-600 mb-3">{item.title}</h3>
              <p className="text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
