import React from 'react';

const ProgressBar = ({ progress = 0, statusText = 'Processing' }) => {
  return (
    <div className="relative w-full bg-gray-300 rounded-full h-4">
      <div
        className="absolute top-0 left-0 h-full bg-teal-500 rounded-sm transition-all duration-300"
        style={{ width: `${progress}%` }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium ">
          {statusText}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
