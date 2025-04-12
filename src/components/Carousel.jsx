import React, { useState } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Eventos:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
      image: "/public/img1.jpeg", // Asegúrate de tener la imagen en la carpeta correcta
    },
    {
      title: "Noticias:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
      image: "/public/img2.jpeg", // Asegúrate de tener la imagen en la carpeta correcta
    },
    {
      title: "Mentores:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
      image: "/public/img3.jpeg", // Asegúrate de tener la imagen en la carpeta correcta
    },
    // Puedes añadir más slides aquí
  ];

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-12 py-8">
        <div className="relative h-[400px] bg-gray-400 rounded-lg"> {/* Fondo gris temporal */}
          {/* Contenido */}
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xl mb-8">
              {slides[currentSlide].description}
            </p>

            {/* Indicadores */}
            <div className="flex gap-4 mb-4">
              {[0, 1, 2].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full bg-[#8B0D37]`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;