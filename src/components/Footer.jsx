// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faYoutube, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const footerColumns = [
    {
      title: "ENLACES ÚTILES",
      links: [
        { name: "Calendario Académico", url: "#calendario" },
        { name: "Liderazgo", url: "#liderazgo" },
        { name: "Carreras", url: "#carreras" },
        { name: "Eventos", url: "#eventos" },
        { name: "Noticias", url: "#noticias" },
        { name: "Políticas", url: "#politicas" },
        { name: "Información al Consumidor", url: "#informacion" },
        { name: "Preparación para Emergencias", url: "#emergencias" },
        { name: "Declaraciones Institucionales", url: "#declaraciones" }
      ]
    },
    {
      title: "VISITA INCUVA LAB",
      links: [
        { name: "Campus y Visitas Virtuales", url: "#campus" },
        { name: "Mapas y Direcciones", url: "#mapas" },
        { name: "Transporte", url: "#transporte" },
        { name: "Laboratorios", url: "#laboratorios" },
        { name: "Espacios de Innovación", url: "#espacios" },
        { name: "La Paz", url: "#lapaz" }
      ]
    }
  ];

  const socialIcons = [
    { name: "Facebook", icon: faFacebookF, url: "#facebook" },
    { name: "Twitter", icon: faTwitter, url: "#twitter" },
    { name: "Instagram", icon: faInstagram, url: "#instagram" },
    { name: "YouTube", icon: faYoutube, url: "#youtube" },
    { name: "LinkedIn", icon: faLinkedinIn, url: "#linkedin" }
  ];

  return (
    <footer className="bg-[#1C1C1C] text-white pt-12 pb-6">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Columnas de enlaces */}
          {footerColumns.map((column, index) => (
            <div key={index}>
              <h3 className="text-sm font-bold mb-6 text-gray-300">
                {column.title}
              </h3>
              <ul>
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="mb-3">
                    <a 
                      href={link.url} 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Tercera columna con logo/campaña */}
          <div>
            <h3 className="text-sm font-bold mb-6 text-gray-300">
              INCUVA HOY
            </h3>
            
            <div className="mt-4 text-center">
              <img 
                src="/logo-univalle.png" 
                alt="Campaña Incuva Lab" 
                className="mx-auto h-24 w-auto mb-4"
              />
              <p className="text-gray-400 mt-2">
                Impulsamos la innovación y el emprendimiento para un futuro mejor
              </p>

              {/* Botón que lleva a Contact.jsx */}
              <Link 
                to="/contact"
                className="inline-block mt-6 px-6 py-2 bg-[#8B0D37] text-white rounded hover:bg-opacity-90 transition-colors duration-200"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="h-px bg-gray-700 my-8"></div>

        {/* Información institucional y redes sociales */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">La Paz, Bolivia</p>
          </div>
          
          <div className="flex flex-wrap justify-center mb-4 md:mb-0">
            <a href="#relaciones" className="text-gray-400 hover:text-white text-sm mx-2 my-1">Relaciones Universitarias</a>
            <a href="#privacidad" className="text-gray-400 hover:text-white text-sm mx-2 my-1">Privacidad</a>
            <a href="#accesibilidad" className="text-gray-400 hover:text-white text-sm mx-2 my-1">Accesibilidad</a>
            <a href="#copyright" className="text-gray-400 hover:text-white text-sm mx-2 my-1">Copyright</a>
            <a href="#sitio" className="text-gray-400 hover:text-white text-sm mx-2 my-1">Información del Sitio</a>
            <Link to="/contact" className="text-gray-400 hover:text-white text-sm mx-2 my-1">Contáctanos</Link>
          </div>
          
          <div className="flex space-x-4">
            {socialIcons.map((social, index) => (
              <a 
                key={index}
                href={social.url}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={social.name}
              >
                <FontAwesomeIcon icon={social.icon} className="text-xl" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
