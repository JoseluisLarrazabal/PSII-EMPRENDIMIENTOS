import React, { useState } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Eventos:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
      image: "/img1.jpeg", // Corregida la ruta de la imagen
    },
    {
      title: "Noticias:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
      image: "/img2.jpeg", // Corregida la ruta de la imagen
    },
    {
      title: "Mentores:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
      image: "/img3.jpeg", // Corregida la ruta de la imagen
    },
    // Puedes añadir más slides aquí
  ];

  return (
    <div className="w-full">
      <div className="relative w-full h-[500px] overflow-hidden"> {/* Misma altura que VideoHero */}
        {/* Imagen de fondo */}
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-500"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
        >
          {/* Fallback si la imagen no carga */}
          <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
        </div>

        {/* Capa semitransparente para mejorar legibilidad (igual que en VideoHero) */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>

        {/* Contenido superpuesto */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end px-8 md:px-16 max-w-[1400px] mx-auto">
          <div className="pb-12"> {/* Padding bottom para separar del borde inferior */}
            <h2 className="text-white text-3xl font-bold mb-2">
              {slides[currentSlide].title}
            </h2>
            <p className="text-white text-xl mb-8">
              {slides[currentSlide].description}
            </p>

            {/* Indicadores */}
            <div className="flex gap-4 mb-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full ${
                    currentSlide === index 
                      ? 'bg-[#8B0D37] ring-2 ring-white' 
                      : 'bg-[#8B0D37] bg-opacity-60'
                  } transition-all`}
                  aria-label={`Ver slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Botones de navegación (opcional) */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-all z-20"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          aria-label="Slide anterior"
        >
          &#10094;
        </button>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-all z-20"
          onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
          aria-label="Siguiente slide"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Carousel;