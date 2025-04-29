import React from 'react';

const LoadingSpinner = ({ message = "Cargando...", size = "default" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className={`animate-spin rounded-full border-t-4 border-blue-500 border-opacity-50 border-solid ${sizeClasses[size]}`}></div>
      {message && (
        <p className="mt-4 text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;