import React, { useRef } from 'react';
import mentor1 from '/mentor1.jpg';
import mentor2 from '/mentor2.jpg';
import mentor3 from '/mentor3.jpg';
import mentor4 from '/mentor4.jpg';
import mentor5 from '/mentor5.jpg';
import mentor6 from '/mentor6.jpg';
import mentoriaPareja from '/fondo-mentoring.jpg';

const mentors = [
  {
    img: mentor1,
    name: 'Shubham Sharma',
    role: 'Adm. de Empresas',
    sessions: '77 sessions (3 reviews)',
  },
  {
    img: mentor2,
    name: 'Swati Shukla',
    role: 'Ingeniería Telecomunicaciones',
    sessions: '143 sessions (16 reviews)',
  },
  {
    img: mentor3,
    name: 'Mike Ponce',
    role: 'Lic. en Ciencias de la Computación',
    sessions: '516 sessions (53 reviews)',
  },
  {
    img: mentor4,
    name: 'Carla White',
    role: 'Ciencias de la Computación e Informática.',
    sessions: '566 sessions (13 reviews)',
  },
  {
    img: mentor5,
    name: 'Susan Davilas',
    role: 'Adm. de Empresas',
    sessions: '26 sessions (45 reviews)',
  },
  {
    img: mentor6,
    name: 'Roberto Pérez',
    role: 'Ciencias de la Computación e Informática.',
    sessions: '23 sessions (35 reviews)',
  },
];

const MentoringPage = () => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 320;
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white text-center font-montserrat">
      {/* Imagen de fondo con título */}
      <div className="relative">
        <img
          src="/fondo-mentoring1.jpg"
          alt="Mentoría"
          className="w-full h-72 object-cover"
        />
        <h2 className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
          Descubre los mejores mentores del mundo
        </h2>
      </div>

      {/* Sección de introducción con imagen */}
      <div className="flex flex-col md:flex-row items-center justify-center my-16 px-6 gap-8 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2">
          <img
            src={mentoriaPareja}
            alt="Sesión de mentoría"
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 text-left">
          <h3 className="text-2xl font-semibold mb-4 text-[#880043]">
            Tu próximo capítulo, posible gracias a la mentoría
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            Conecta con expertos apasionados que te guiarán en tu camino profesional.
            Desde decisiones importantes hasta consejos prácticos, un buen mentor puede
            marcar la diferencia en tu crecimiento.
          </p>
        </div>
      </div>

      {/* Texto central */}
      <div className="my-12 px-6">
        <h3 className="text-xl font-semibold mb-2">Encuentra Tu Mentor Ideal:</h3>
        <p className="text-lg mb-6">¡Desliza y Descubre!</p>

        {/* Carrusel con flechas */}
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#880043] text-white rounded-full p-2 z-10 hover:bg-opacity-80"
          >
            &lt;
          </button>

          <div
            ref={carouselRef}
            className="flex space-x-6 overflow-x-auto px-2 scroll-smooth"
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE
            }}
          >
            {/* Oculta scrollbar en Chrome */}
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {mentors.map((mentor, index) => (
              <div
                key={index}
                className="min-w-[300px] bg-white rounded-lg shadow-lg border p-4 flex-shrink-0"
              >
                <img
                  src={mentor.img}
                  alt={mentor.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h4 className="font-bold text-lg">{mentor.name}</h4>
                <p className="text-sm text-gray-600">{mentor.role}</p>
                <p className="text-sm text-gray-500 mt-1">{mentor.sessions}</p>
                <div className="mt-4 flex gap-2 justify-center">
                  <button className="bg-[#880043] text-white px-4 py-1 rounded hover:bg-opacity-80">
                    Me interesa
                  </button>
                  <button className="bg-[#66B5CB] text-white px-4 py-1 rounded hover:bg-opacity-80">
                    No me interesa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#880043] text-white rounded-full p-2 z-10 hover:bg-opacity-80"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentoringPage;
