// SubNav.jsx
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
    <div className="w-full bg-white py-6">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-12">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="Logo.png" 
            alt="Incuvia Lab" 
            className="h-24 w-auto"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center space-x-10">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="text-gray-800 hover:text-[#8B0D37] transition-colors duration-200 text-lg font-medium"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SubNav;