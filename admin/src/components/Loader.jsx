import React from 'react';
const Loader = ({ message = "Loading", className = "" }) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-800 ${className}`}>
      <p className="text-xl text-gray-800 font-semibold flex items-center animate-pulse-text">
        <span>{message}</span>
        <div className="flex space-x-3 ml-4">
          <div className="w-3 h-3 bg-pink-600 rounded-sm animate-bounce-box animation-delay-0 hover:scale-110 transition-transform" />
          <div className="w-3 h-3 bg-pink-600 rounded-sm animate-bounce-box animation-delay-200 hover:scale-110 transition-transform" />
          <div className="w-3 h-3 bg-pink-600 rounded-sm animate-bounce-box animation-delay-400 hover:scale-110 transition-transform" />
        </div>
      </p>
    </div>
  );
};
export default Loader;
