// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B0D37]"></div>
      <p className="ml-4 text-gray-600">Cargando cursos...</p>
    </div>
  );
};

export default LoadingSpinner;