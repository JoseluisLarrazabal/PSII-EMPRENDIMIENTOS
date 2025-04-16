// src/components/SocialMediaGallery.jsx
import React from "react";

function SocialMediaGallery() {
  return (
    <div className="max-w-[1200px] mx-auto px-12 py-8">
      {/* Contenedor principal de la galería */}
      <div className="flex justify-center gap-4 mb-6">
        {/* Primera imagen con borde azul */}
        <div className="w-1/4 aspect-[3/4] border-4 border-blue-400 rounded-md overflow-hidden">
          <img 
            src="/students-table.png" 
            alt="Estudiantes colaborando en una mesa"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        {/* Segunda columna con dos imágenes apiladas */}
        <div className="w-1/4 flex flex-col gap-4">
          <div className="aspect-[4/3] overflow-hidden">
            <img 
              src="/students-outdoor.png" 
              alt="Estudiantes en área verde"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <img 
              src="/students-devices.png" 
              alt="Estudiantes usando dispositivos"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        
        {/* Tercera imagen */}
        <div className="w-1/4 aspect-[3/4] overflow-hidden">
          <img 
            src="/library-study.png" 
            alt="Estudiantes en biblioteca"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        {/* Cuarta imagen */}
        <div className="w-1/4 aspect-[3/4] overflow-hidden">
          <img 
            src="/student-phone.png" 
            alt="Estudiante usando teléfono"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      
      {/* Botón de Redes Sociales */}
      <div className="flex justify-center">
        <button className="bg-[#5EBFBF] text-white font-montserrat py-2 px-8 rounded-md hover:bg-[#4da3a3] transition-colors">
          Redes Sociales
        </button>
      </div>
    </div>
  );
}

export default SocialMediaGallery;