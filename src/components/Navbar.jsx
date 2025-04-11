import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#8B0D37] w-full flex items-center justify-between px-4 py-3">
      {/* Left side - Title */}
      <div className="text-white text-xl font-semibold">
        CENTRO DE EMPRENDIMIENTO UNIVALLE
      </div>
      
      {/* Right side - Search */}
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar"
            className="bg-[#6B0A2A] text-white placeholder-gray-300 px-4 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;