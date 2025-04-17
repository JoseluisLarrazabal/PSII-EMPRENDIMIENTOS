// SubNav.jsx con dimensiones ajustadas al logo
import React, { useState } from 'react';

const SubNav = () => {
  const [activeItem, setActiveItem] = useState(null);
  
  const menuItems = [
    { name: 'Acerca de nosotros', link: '#acerca' },
    { name: 'Nuestros servicios', link: '#servicios' },
    { name: 'CrowdFunding', link: '#crowdfunding' },
    { name: 'Apoya a emprendedor', link: '#apoya' },
    { name: 'Postulaciones', link: '#postulaciones' }
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-12">
        {/* Logo - sin padding adicional */}
        <div className="flex items-center h-20">
          <img 
            src="/logo-incuvalab.png" 
            alt="Incuvia Lab" 
            className="h-full w-auto object-contain"
          />
        </div>

        {/* Navigation Menu - centrado verticalmente */}
        <nav className="flex items-center h-20">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className={`relative px-3 h-full flex items-center mx-1 md:mx-3 text-sm md:text-base font-medium transition-all duration-200 border-b-2 ${
                activeItem === index 
                  ? 'text-[#8B0D37] border-[#8B0D37]' 
                  : 'text-gray-700 border-transparent hover:text-[#8B0D37] hover:border-[#8B0D37]'
              }`}
              onClick={() => setActiveItem(index)}
            >
              {item.name}
            </a>
          ))}
          <a 
            href="#contacto"
            className="ml-2 md:ml-4 px-4 py-2 bg-[#8B0D37] text-white rounded-md font-medium hover:bg-[#6E0B2A] transition-colors duration-200 flex items-center"
          >
            <span>Contacto</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default SubNav;