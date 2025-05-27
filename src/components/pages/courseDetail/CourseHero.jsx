import React from 'react';
import { useNavigate } from "react-router-dom";
import { enrollInCourse } from '../../../services/api'; // Ajusta la ruta si es necesario

// URLs de respaldo actualizadas
const defaultLogo = 'https://placehold.co/200x100/8B0D37/FFFFFF?text=Logo';
const defaultBg = 'https://placehold.co/1920x1080/8B0D37/FFFFFF?text=Course+Image';

// Componente que muestra el banner principal del curso con información destacada
const CourseHero = ({ course }) => {
  const navigate = useNavigate();

  if (!course) return null;

  // Manejo seguro de URLs desde la base de datos
  const logoUrl = course?.logo_url || defaultLogo;
  const bgUrl = course?.image_url || defaultBg;
  
  // Validación mejorada de URLs
  const validateUrl = (url) => {
    if (!url) return defaultLogo;
    
    try {
      if (url.startsWith('http')) {
        return url;
      }
      // Si es una ruta relativa, convertir a URL completa
      return `${process.env.REACT_APP_API_URL}/images/${url}`;
    } catch (error) {
      console.error('Error validating URL:', error);
      return url === logoUrl ? defaultLogo : defaultBg;
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("pendingEnrollCourse", course.id);
      navigate("/login");
      return;
    }
    try {
      await enrollInCourse(course.id, token);
      navigate(`/curso/${course.id}/contenido`);
    } catch (error) {
      alert(error.message || "No se pudo inscribir al curso.");
    }
  };

  console.log("DEBUG course:", course);
  console.log("DEBUG course.id:", course?.id);

  return (
    <div 
      className="relative h-80 md:h-96 bg-cover bg-center bg-gray-800" 
      style={{ 
        backgroundImage: `url(${validateUrl(bgUrl)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay para mejorar legibilidad del texto sobre la imagen */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30">
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          {/* Logo del proveedor */}
          <div className="mb-4">
            <img 
              src={validateUrl(logoUrl)}
              alt={course.provider || 'Logo del curso'} 
              className="h-10 sm:h-12 object-contain bg-white/90 p-1 rounded"
              onError={(e) => {
                console.log('Error cargando imagen:', e.target.src);
                e.target.src = defaultLogo;
                e.target.onerror = null;
              }}
            />
          </div>
          
          {/* Título del curso */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 max-w-4xl">
            {course.title}
          </h1>
          
          {/* Información del proveedor y escuela */}
          <div className="text-white/90 mb-6">
            <span>Ofrecido por: </span>
            <strong className="font-medium">{course.provider}</strong>
            {course.school_name && (
              <span className="ml-2">- {course.school_name}</span>
            )}
          </div>
          
          {/* Estadísticas del curso */}
          <div className="flex flex-wrap items-center text-white/80 text-sm mb-6 gap-4">
            {course.rating && (
              <div className="flex items-center">
                <span className="flex items-center mr-1">
                  {/* Estrellas basadas en rating */}
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill={i < Math.floor(course.rating) ? "currentColor" : "none"}
                      stroke="currentColor"
                      className={`w-4 h-4 ${i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-400"}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </span>
                <span>{course.rating.toFixed(1)}</span>
              </div>
            )}
            
            {course.enrollment_count > 0 && (
              <div>
                <span>{new Intl.NumberFormat().format(course.enrollment_count)} estudiantes inscritos</span>
              </div>
            )}
            
            {course.level && (
              <div className="bg-white/20 px-2 py-0.5 rounded text-white">
                {course.level}
              </div>
            )}
          </div>
          
          {/* Botón de inscripción */}
          <button
            className="bg-[#8B0D37] hover:bg-[#6E0B2A] text-white font-medium py-3 px-6 rounded-md transition duration-200 w-full sm:w-auto max-w-xs"
            onClick={handleEnroll}
          >
            Inscríbete Ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseHero;