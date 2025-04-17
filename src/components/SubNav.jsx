// SubNav.jsx con React Router
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SubNav = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);
  
  const menuItems = [
    { name: 'Acerca de nosotros', path: '/quienes-somos' },
    { name: 'Nuestros servicios', path: '/servicios' },
    { name: 'CrowdFunding', path: '/crowdfunding' },
    { name: 'Apoya a emprendedor', path: '/apoya' },
    { name: 'Postulaciones', path: '/postulaciones' }
  ];

  // Determinar el ítem activo basado en la ruta actual
  React.useEffect(() => {
    const currentPath = location.pathname;
    const activeIndex = menuItems.findIndex(item => item.path === currentPath);
    if (activeIndex >= 0) {
      setActiveItem(activeIndex);
    }
  }, [location.pathname]);

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-12">
        {/* Logo - con enlace a la página principal */}
        <Link to="/" className="flex items-center h-20">
          <img 
            src="/logo-incuvalab.png" 
            alt="Incuva Lab" 
            className="h-full w-auto object-contain"
          />
        </Link>

        {/* Navigation Menu - centrado verticalmente */}
        <nav className="flex items-center h-20">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`relative px-3 h-full flex items-center mx-1 md:mx-3 text-sm md:text-base font-medium transition-all duration-200 border-b-2 ${
                activeItem === index 
                  ? 'text-[#8B0D37] border-[#8B0D37]' 
                  : 'text-gray-700 border-transparent hover:text-[#8B0D37] hover:border-[#8B0D37]'
              }`}
              onClick={() => setActiveItem(index)}
            >
              {item.name}
            </Link>
          ))}
          <Link 
            to="/contacto"
            className="ml-2 md:ml-4 px-4 py-2 bg-[#8B0D37] text-white rounded-md font-medium hover:bg-[#6E0B2A] transition-colors duration-200 flex items-center"
          >
            <span>Contacto</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default SubNav;