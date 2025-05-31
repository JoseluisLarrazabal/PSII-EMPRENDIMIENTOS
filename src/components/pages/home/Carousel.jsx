<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState('right');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
=======
import React, { useState } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
  
  const slides = [
    {
      title: "Eventos:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
<<<<<<< HEAD
      image: "/img1.jpeg",
=======
      image: "/img1.jpeg", // Corregida la ruta de la imagen
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
    },
    {
      title: "Noticias:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
<<<<<<< HEAD
      image: "/img2.jpeg",
=======
      image: "/img2.jpeg", // Corregida la ruta de la imagen
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
    },
    {
      title: "Mentores:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
<<<<<<< HEAD
      image: "/img3.jpeg",
    },
  ];

  // Función para avanzar al siguiente slide
  const goToNextSlide = useCallback(() => {
    setTransitionDirection('right');
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Función para retroceder al slide anterior
  const goToPrevSlide = useCallback(() => {
    setTransitionDirection('left');
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Efecto para el autoplay
  useEffect(() => {
    let intervalId;
    
    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        goToNextSlide();
      }, 5000); // Cambia cada 5 segundos
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoPlaying, goToNextSlide]);

  // Pausar autoplay cuando el usuario interactúa
  const handleUserInteraction = (action) => {
    setIsAutoPlaying(false);
    action();
    // Reanudar autoplay después de 10 segundos de inactividad
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="w-full group">
      <div className="relative w-full h-[500px] overflow-hidden">
        {/* Contenedor de slides con animación */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
                index === currentSlide
                  ? 'translate-x-0'
                  : index < currentSlide
                    ? '-translate-x-full'
                    : 'translate-x-full'
              }`}
            >
              {/* Imagen de fondo */}
              <div 
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay para mejor legibilidad */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>

              {/* Contenido del slide */}
              {index === currentSlide && (
                <div className="relative z-10 w-full h-full flex flex-col justify-end px-8 md:px-16 max-w-[1400px] mx-auto">
                  <div className="pb-12">
                    <h2 className="text-white text-3xl font-bold mb-2">
                      {slide.title}
                    </h2>
                    <p className="text-white text-xl mb-8">
                      {slide.description}
                    </p>

                    {/* Indicadores */}
                    <div className="flex gap-4 mb-4">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleUserInteraction(() => {
                              setTransitionDirection(idx > currentSlide ? 'right' : 'left');
                              setCurrentSlide(idx);
                            });
                          }}
                          className={`w-4 h-4 rounded-full ${
                            currentSlide === idx 
                              ? 'bg-[#8B0D37] ring-2 ring-white' 
                              : 'bg-[#8B0D37] bg-opacity-60'
                          } transition-all`}
                          aria-label={`Ir al slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botones de navegación */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-all z-20 opacity-0 group-hover:opacity-100"
          onClick={() => handleUserInteraction(goToPrevSlide)}
=======
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
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
          aria-label="Slide anterior"
        >
          &#10094;
        </button>
        <button 
<<<<<<< HEAD
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-all z-20 opacity-0 group-hover:opacity-100"
          onClick={() => handleUserInteraction(goToNextSlide)}
=======
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-all z-20"
          onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
          aria-label="Siguiente slide"
        >
          &#10095;
        </button>
<<<<<<< HEAD

=======
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
      </div>
    </div>
  );
};

export default Carousel;