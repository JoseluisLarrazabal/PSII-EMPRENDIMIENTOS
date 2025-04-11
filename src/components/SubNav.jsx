// src/components/SubNav.jsx
import React from 'react';

const SubNav = () => {
  const menuItems = [
    'Acerca de nosotros',
    'Nuestros servicios',
    'Crowd Funding',
    'Apoya a emprendedor',
    'Postulaciones'
  ];

  return (
    <div className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <img 
          src="/public/Logo.png" 
          alt="Incuvia Lab" 
          className="h-12"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex items-center space-x-8">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className="text-gray-700 hover:text-[#8B0D37] transition-colors duration-200 text-sm font-medium"
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default SubNav;