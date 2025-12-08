import React from "react";

const LoadingSpinner = ({ message = "جاري التحميل..." }) => {
  return (
    <div className="flex flex-col justify-center items-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-blue-600 font-semibold animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
