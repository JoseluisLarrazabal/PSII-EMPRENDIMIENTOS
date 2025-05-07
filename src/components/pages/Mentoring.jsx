import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import mentoriaPareja from '/fondo-mentoring.jpg';
import defaultImg from '/mentor1.jpg'; 

const MentoringPage = () => {
  const [mentors, setMentors] = useState([]);
  const [usuarioId, setUsuarioId] = useState(1);
  const [mentorSeleccionadoId, setMentorSeleccionadoId] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/mentores')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMentors(data.data);
        }
      })
      .catch((err) => console.error('Error al cargar mentores:', err));
  }, []);

  const scroll = (direction) => {
    const scrollAmount = 320;
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleClick = async (mentorId, meInteresa) => {
    try {
      await axios.post('http://localhost:4000/mentoring', {
        mentor_id: mentorId,
        usuario_id: usuarioId,
        me_interesa: meInteresa ? 1 : 0,
        no_me_interesa: meInteresa ? 0 : 1,
      });

      setMentors(mentors.map((mentor) =>
        mentor.id === mentorId
          ? { ...mentor, me_interesa: meInteresa ? 1 : 0, no_me_interesa: meInteresa ? 0 : 1 }
          : mentor
      ));

      if (meInteresa) {
        setMentorSeleccionadoId(mentorId);
        alert('¡Te interesa este mentor!');
      } else {
        setMentorSeleccionadoId(null);
        alert('No te interesa este mentor.');
      }
    } catch (err) {
      console.error(err);
      alert('Error al registrar preferencia.');
    }
  };

  return (
    <div className="bg-white text-center font-montserrat">
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

      <div className="my-12 px-6">
        <h3 className="text-xl font-semibold mb-2">Encuentra Tu Mentor Ideal:</h3>
        <p className="text-lg mb-6">¡Desliza y Descubre!</p>

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
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mentors.map((mentor) => {
              const estaSeleccionado = mentorSeleccionadoId === mentor.id;
              const haySeleccion = mentorSeleccionadoId !== null && !estaSeleccionado;

              return (
                <div
                  key={mentor.id}
                  className={`min-w-[300px] bg-white rounded-lg shadow-lg border p-4 flex-shrink-0 ${estaSeleccionado ? 'border-4 border-[#880043]' : ''}`}
                >
                  <img
                    src={defaultImg}
                    alt={mentor.nombre}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h4 className="font-bold text-lg">{mentor.nombre}</h4>
                  <p className="text-sm text-gray-600">{mentor.area_experiencia}</p>
                  <p className="text-sm text-gray-500 mt-1">{mentor.disponibilidad}</p>
                  <div className="mt-4 flex gap-2 justify-center">
                    <button
                      onClick={() => handleClick(mentor.id, true)}
                      disabled={haySeleccion}
                      className={`px-4 py-1 rounded text-white ${haySeleccion ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#880043] hover:bg-opacity-80'}`}
                    >
                      Me interesa
                    </button>
                    <button
                      onClick={() => handleClick(mentor.id, false)}
                      disabled={haySeleccion}
                      className={`px-4 py-1 rounded text-white ${haySeleccion ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#66B5CB] hover:bg-opacity-80'}`}
                    >
                      No me interesa
                    </button>
                  </div>
                </div>
              );
            })}
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
