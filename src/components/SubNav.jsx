import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SubNav = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = [
    { name: 'Acerca de nosotros', path: '/quienes-somos' },
    { name: 'Nuestros servicios', path: '/servicios', isDropdown: true },
    { name: 'CrowdFunding', path: '/crowdfunding' },
    { name: 'Mentoring', path: '/mentoring' },
    { name: 'Eventos', path: '/eventos' }
  ];

  const dropdownItems = [
    { name: 'Inspiring', path: '/servicios/inspiring' },
    { name: 'Challengers', path: '/servicios/challengers' },
    { name: 'Revenue', path: '/servicios/revenue' },
    { name: 'Partners', path: '/servicios/partners' }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeIndex = menuItems.findIndex(item => currentPath.startsWith(item.path));
    setActiveItem(activeIndex >= 0 ? activeIndex : null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleArrowClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(prev => !prev);
  };

  const handleOptionClick = () => {
    setIsDropdownOpen(false);
  };

  const renderDropdown = () => (
    <div
      className={`absolute top-full left-0 w-56 bg-white shadow-lg rounded-md mt-2 z-50 transform transition-all duration-300 ease-in-out ${
        isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {dropdownItems.map((dropdownItem, dropdownIndex) => (
        <Link
          key={dropdownIndex}
          to={dropdownItem.path}
          className={`block px-4 py-2 text-sm text-gray-700 hover:text-[#8B0D37] hover:bg-gray-100 ${
            location.pathname === dropdownItem.path ? 'text-[#8B0D37]' : ''
          }`}
          onClick={handleOptionClick}
        >
          {dropdownItem.name}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-12">
        <Link to="/" className="flex items-center h-20">
          <img
            src="/logo-incuvalab.png"
            alt="Incuva Lab"
            className="h-full w-auto object-contain"
          />
        </Link>

        <nav className="flex items-center h-20 relative gap-2" ref={dropdownRef}>
          {menuItems.map((item, index) => (
            item.isDropdown ? (
              <div key={index} className="relative flex items-center gap-1 md:gap-1.5">
                <Link
                  to={item.path}
                  className="px-3 h-20 flex items-center text-sm md:text-base font-medium relative"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span
                    className={`relative after:content-[''] after:block after:h-0.5 after:bg-[#8B0D37] after:transition-all after:duration-300 after:mx-auto
                      ${activeItem === index
                        ? 'text-[#8B0D37] after:w-full'
                        : 'text-gray-700 hover:text-[#8B0D37] after:w-0 hover:after:w-full'}`}
                  >
                    {item.name}
                  </span>
                </Link>
                <button
                  onClick={handleArrowClick}
                  className="h-20 flex items-center px-1 text-gray-700 hover:text-[#8B0D37]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {renderDropdown()}
              </div>
            ) : (
              <Link
                key={index}
                to={item.path}
                className="px-3 h-20 flex items-center mx-1 md:mx-3 text-sm md:text-base font-medium relative"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span
                  className={`relative after:content-[''] after:block after:h-0.5 after:bg-[#8B0D37] after:transition-all after:duration-300 after:mx-auto
                    ${activeItem === index
                      ? 'text-[#8B0D37] after:w-full'
                      : 'text-gray-700 hover:text-[#8B0D37] after:w-0 hover:after:w-full'}`}
                >
                  {item.name}
                </span>
              </Link>
            )
          ))}

          <Link
            to="/login"
            className="ml-2 md:ml-4 px-4 py-2 bg-[#8B0D37] text-white rounded-md font-medium hover:bg-[#6E0B2A] transition-colors duration-200 flex items-center"
            onClick={() => setIsDropdownOpen(false)}
          >
            <span>Login</span>
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
