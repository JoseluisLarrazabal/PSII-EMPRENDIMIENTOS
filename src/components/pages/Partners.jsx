import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import partnerImage from '/oratoria.jpg';
import expert1 from '/experto1.jpg';
import expert2 from '/experto2.jpg';
import expert3 from '/experto3.jpg';
import expert4 from '/experto4.jpg';
import expert5 from '/experto5.png';
import profile1 from '/tinder.jpg'; 
import icon1 from '/icon1.png';
import icon2 from '/icon2.png';
import icon3 from '/icon3.png';

import '../../styles/Partners.css';


const PartnerSection = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [hiddenCards, setHiddenCards] = useState([]);
  const [visibleExperts, setVisibleExperts] = useState(5);
  const [interesCount, setInteresCount] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [expertsData, setExpertsData] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/mentors');
        console.log('Datos obtenidos:', response.data);
        if (Array.isArray(response.data)) {
          setExpertsData(response.data);
        } else {
          console.error('La respuesta no es un array:', response.data);
        }
      } catch (error) {
        console.error('Error al cargar los mentores:', error);
      }
    };

    fetchMentors();
  }, []);


  

  const handleHideCard = async (index, isInterested, mentorId) => {
    const card = document.getElementById(`expert-card-${index}`);
    if (card) {
      card.classList.add('fade-out');

      try {
        // Insertar la selección en la tabla mentoring
        await axios.post('http://localhost:8000/mentoring', {
          mentorId: mentorId,
          meInteresa: isInterested
        });
  
        console.log('Selección guardada exitosamente');
      } catch (error) {
        console.error('Error al guardar la selección:', error);
      }

      if (isInterested) {
        const newCount = interesCount + 1;
        setInteresCount(newCount);

        if (newCount === 3) {
          setShowMatchModal(true);
        }
      }

      setTimeout(() => {
        setHiddenCards((prev) => [...prev, index]);
        const nextIndex = expertsData.findIndex((_, i) => i >= visibleExperts && !hiddenCards.includes(i));

        if (nextIndex !== -1) {
          setVisibleExperts((prev) => Math.max(prev, nextIndex + 1));
        }
      }, 500);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setVisibleExperts(expertsData.length);
    } else {
      setVisibleExperts(5);
    }
  };

  const handleCloseMatchModal = () => {
    setInteresCount(0);
    setShowMatchModal(false);
  };

  const handleRegisterData = () => {
    navigate('/crud-partner');
  };

  if (!Array.isArray(expertsData)) {
    return <div>Error: Los datos de mentores no son válidos.</div>;
  }

  if (!expertsData.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Sección texto */}
      <div className="expert-info bg-white text-center py-10 px-5 mt-8">
        <h3 className="font-montserrat text-3xl font-bold text-black mb-2 text-left">
          Partners de primer nivel. Acceder a las mejores soluciones nunca fue tan fácil y accesible
        </h3>
        <div
          className="ver-mas flex items-center justify-start gap-3 mt-4 cursor-pointer transition-transform duration-300 ease-in-out text-left pl-0"
          onClick={toggleShowAll}
        >
          <span className="font-montserrat text-xl text-black font-normal">
            {showAll ? 'Ver menos' : 'Ver más'}
          </span>
          <span className="flecha text-3xl text-black transition-transform duration-300 ease-in-out transform hover:translate-x-2">
            {showAll ? '←' : '→'}
          </span>
        </div>
      </div>

      <div className="expert-cards-container">
        {expertsData.map((mentor, index) => (
          (index < visibleExperts && !hiddenCards.includes(index)) && (
            <div
              key={index}
              id={`expert-card-${index}`}
              className="expert-card show transition-all duration-500 ease-out"
            >
              <div className="relative">
                <img
                  src={profile1}
                  alt="Foto del mentor"
                  className="w-full h-[220px] object-cover rounded-xl"
                />
                <div className="absolute top-2 right-2 text-xl text-red-500 bg-white rounded-full p-1">
                  ❤️
                </div>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 my-3">{mentor.nombre} ✔</h4>
              <p className="text-base text-gray-600 my-1">Tel: {mentor.telefono}</p>
              <p className="text-base text-gray-600 my-1">Área: {mentor.area_experiencia}</p>
              <p className="text-base text-gray-600 my-1">Disponibilidad: {mentor.disponibilidad}</p>
              <div className="flex justify-center gap-2 mt-3">
                <button
                  className="bg-[#880043] text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:opacity-90"
                  onClick={() => handleHideCard(index, true, mentor.id)}
                >
                  Me interesa
                </button>
                <button
                  className="bg-[#66B5CB] text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:opacity-90"
                  onClick={() => handleHideCard(index, false, mentor.id)}
                >
                  No interesa
                </button>
              </div>
            </div>
          )
        ))}
      </div>



      {showMatchModal && (
        <div className="match-modal fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="match-content bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-4">¡Hiciste match!</h2>
            <p className="text-center text-lg mb-6">¡Felicitaciones, encontraste a tu Partner ideal! ❤️</p>
            <div className="modal-buttons flex flex-col gap-4 items-center">
              <button 
                className="register-button bg-[#66B5CB] text-white py-2 px-6 rounded-lg shadow-md"
                onClick={handleRegisterData}
              >
                Registrar datos
              </button>
              <button 
                className="py-2 px-6 rounded-lg bg-[#880043] text-white shadow-md"
                onClick={handleCloseMatchModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Línea final */}
      <div className="border-t-4 border-black w-[80%] mx-auto mt-8 mb-8"></div>

      {/* Nueva sección con íconos */}
      <div className="mt-16 text-center px-5">
        <div className="flex justify-center flex-wrap gap-10">
          {/* Item 1 */}
          <div className="flex flex-col items-center mb-8 max-w-[220px] flex-basis-[22%]">
            <img src={icon1} alt="Asesoramiento Personalizado" className="w-[100px] h-[100px] mb-4" />
            <p className="text-xl font-bold text-black mb-2">BUSCA UN PARTNER</p>
            <p className="text-lg font-normal text-gray-600 leading-6 text-center">
              Descubre y elige entre nuestra lista de Partners listos para ayudarte y COlaborarte
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center mb-8 max-w-[220px] flex-basis-[22%]">
            <img src={icon2} alt="Consultores Internacionales" className="w-[100px] h-[100px] mb-4" />
            <p className="text-xl font-bold text-black mb-2">AGENDA UNA VIDEOCONFERENCIA</p>
            <p className="text-lg font-normal text-gray-600 leading-6 text-center">
              Selecciona un horario que funcione tanto para ti como para la agenda de tu partner.
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center mb-8 max-w-[220px] flex-basis-[22%]">
            <img src={icon3} alt="Soluciones Tecnológicas" className="w-[100px] h-[100px] mb-4" />
            <p className="text-xl font-bold text-black mb-2">CONSULTAS VIRTUALES</p>
            <p className="text-lg font-normal text-gray-600 leading-6 text-center">
              Únete a la videollamada 1 a 1, haz preguntas y recibe asesoramiento partner.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PartnerSection;
