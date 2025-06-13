import React from 'react';
import {
  SparklesIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  ArrowUpIcon,
  CheckBadgeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    title: 'Smart Image Enhancement',
    icon: <SparklesIcon className="h-8 w-8 sm:h-10 sm:w-10 text-fuchsia-600" />,
    text: 'Automatically improves photo quality with AI—making them clearer, sharper, and more vibrant in one click.',
  },
  {
    title: 'Before & After Comparison',
    icon: <EyeIcon className="h-8 w-8 sm:h-10 sm:w-10 text-fuchsia-600" />,
    text: 'Instantly view the transformation. See your original and enhanced images side by side.',
  },
  {
    title: 'Natural Color Boosting',
    icon: <AdjustmentsHorizontalIcon className="h-8 w-8 sm:h-10 sm:w-10 text-fuchsia-600" />,
    text: 'Enhances colors without oversaturation—keeping your images realistic yet stunning.',
  },
  {
    title: 'Super-Resolution Upscaling',
    icon: <ArrowUpIcon className="h-8 w-8 sm:h-10 sm:w-10 text-fuchsia-600" />,
    text: 'Turn low-res images into crisp, high-quality versions. Perfect for prints or HD sharing.',
  },
  {
    title: 'One-Click Simplicity',
    icon: <CheckBadgeIcon className="h-8 w-8 sm:h-10 sm:w-10 text-fuchsia-600" />,
    text: 'Upload and go. No editing skills required—just fast, flawless results.',
  },
  {
    title: 'Safe & Private',
    icon: <LockClosedIcon className="h-8 w-8 sm:h-10 sm:w-10 text-fuchsia-600" />,
    text: 'Your photos stay private. All processing is secure and nothing is stored.',
  },
];

const Features = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-violet-900 text-center mb-4 sm:mb-6 leading-tight">
          Features That Make <span className="text-fuchsia-600">PixelPolish</span> Shine
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 text-center mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed">
          Experience stunning photo transformations in seconds—powered by intelligent AI designed for everyday users.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 ease-in-out text-center flex flex-col items-center"
            >
              <div className="mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-violet-800 mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;