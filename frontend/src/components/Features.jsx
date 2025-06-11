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
    icon: <SparklesIcon className="h-10 w-10 text-fuchsia-600" />,
    text: 'Automatically improves photo quality with AI—making them clearer, sharper, and more vibrant in one click.',
  },
  {
    title: 'Before & After Comparison',
    icon: <EyeIcon className="h-10 w-10 text-fuchsia-600" />,
    text: 'Instantly view the transformation. See your original and enhanced images side by side.',
  },
  {
    title: 'Natural Color Boosting',
    icon: <AdjustmentsHorizontalIcon className="h-10 w-10 text-fuchsia-600" />,
    text: 'Enhances colors without oversaturation—keeping your images realistic yet stunning.',
  },
  {
    title: 'Super-Resolution Upscaling',
    icon: <ArrowUpIcon className="h-10 w-10 text-fuchsia-600" />,
    text: 'Turn low-res images into crisp, high-quality versions. Perfect for prints or HD sharing.',
  },
  {
    title: 'One-Click Simplicity',
    icon: <CheckBadgeIcon className="h-10 w-10 text-fuchsia-600" />,
    text: 'Upload and go. No editing skills required—just fast, flawless results.',
  },
  {
    title: 'Safe & Private',
    icon: <LockClosedIcon className="h-10 w-10 text-fuchsia-600" />,
    text: 'Your photos stay private. All processing is secure and nothing is stored.',
  },
];

const Features = () => {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold text-violet-900 text-center mb-6 leading-tight">
          Features That Make <span className="text-fuchsia-600">PixelPolish</span> Shine
        </h2>
        <p className="text-lg text-gray-700 text-center mb-16 max-w-2xl mx-auto">
          Experience stunning photo transformations in seconds—powered by intelligent AI designed for everyday users.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-80 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 ease-in-out text-center flex flex-col items-center"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-violet-800 mb-3">{feature.title}</h3>
              <p className="text-gray-700 leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
