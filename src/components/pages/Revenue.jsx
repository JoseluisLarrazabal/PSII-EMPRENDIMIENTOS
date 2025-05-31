<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '/revenue.jpg';

const Revenue = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/empresas_servicios");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Convertir el texto de servicios a un array
        const parsedData = data.map((section) => ({
          ...section,
          servicios: section.servicios 
            ? section.servicios.split('\n').filter(item => item.trim())
            : []
        }));

        setSections(parsedData);
        setError(null);
      } catch (err) {
        console.error("❌ Error cargando datos de la API:", err);
        setError("Error al cargar los datos. Por favor intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B0D37]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#8B0D37] text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header con imagen de fondo */}
=======
import React from 'react';
import imageSrc from '/inves.png';
import EmpresaImg from '/empresa.jpg';
import laboratorioImage from '/laboratios.jpg';
import mercadoImage from '/mercado.jpg';
import backgroundImage from '/revenue.jpg';

const Revenue = () => {
  return (
    <>
      {/* Encabezado con imagen de fondo, ajustado para no chocar con el dropdown */}
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
      <div
        className="relative h-[32vh] md:h-[36vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>
<<<<<<< HEAD
        <div className="relative text-white text-center px-5 font-montserrat z-10 flex flex-col justify-center items-center mb-12">
=======
        <div className="relative text-white text-center px-5 font-montserrat z-10 flex flex-col justify-center items-center mb-12"> {/* Agregado mb-12 */}
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
          <h2 className="text-3xl mb-2">¿Estás listo para empezar?</h2>
          <p className="text-xl font-bold">TRABAJA CON NOSOTROS</p>
        </div>
      </div>

<<<<<<< HEAD
      {/* Subtítulo y descripción */}
=======
      {/* Subtítulo */}
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
      <div className="text-center text-lg font-semibold font-montserrat mt-8 text-gray-800">
        🚀 Plataforma de Transferencia Tecnológica
      </div>

<<<<<<< HEAD
=======
      {/* Descripción */}
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
      <div className="text-center text-base font-montserrat text-gray-700 mt-3 leading-relaxed max-w-[800px] mx-auto mb-8">
        ¿Tenés una idea, producto o desafío técnico y no sabés por dónde empezar?<br />
        Esta plataforma está pensada para ayudarte.
      </div>

      <div className="text-center text-base font-montserrat text-gray-700 leading-relaxed max-w-[800px] mx-auto mb-8">
        Actuamos como un puente entre empresas, emprendedores y centros de conocimiento,<br />
        permitiendo el levantamiento de solicitudes tecnológicas para impulsar nuevos desarrollos,<br />
        mejorar procesos o buscar soluciones a medida.
      </div>

<<<<<<< HEAD
      <div className="border-t-[3px] border-black w-4/5 mx-auto my-8"></div>

      {/* Secciones dinámicas desde API */}
      {sections.length > 0 ? (
        sections.map((section, index) => (
          <div key={index}>
            <div className="flex flex-col md:flex-row items-center gap-6 w-4/5 mx-auto mt-10">
              <img
                src={section.imagen_url || 'https://via.placeholder.com/400x250'}
                alt={section.titulo}
                className="w-[400px] h-[250px] object-cover rounded-lg border-[5px] border-gray-900"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x250';
                }}
              />
              <div className="text-lg font-semibold font-montserrat text-gray-800">
                <h2 className="text-2xl mb-2">{section.titulo}</h2>
                <p className="text-base font-normal">{section.descripcion}</p>
              </div>
            </div>

            <div className="text-center text-base font-semibold font-montserrat text-gray-800 mt-8">
              {section.subtitulo}
            </div>

            <ul className="list-disc font-montserrat text-gray-700 text-base mt-4 pl-10 max-w-4xl mx-auto">
              {section.servicios.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate('/crud-revenue')}
                className="bg-[#66B5CB] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#579fb3] transition-all"
              >
                Contacta con nosotros
              </button>
            </div>

            <div className="border-t-[3px] border-black w-4/5 mx-auto my-8"></div>
          </div>
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No hay servicios disponibles actualmente.</p>
        </div>
      )}
=======
      {/* Línea negra */}
      <div className="border-t-[3px] border-black w-4/5 mx-auto my-8"></div>

      {/* Secciones dinámicas con imagen y texto */}
      {[ 
        {
          title: 'INVESTIGADORES',
          img: imageSrc,
          description: 'Desarrollo de servicios enfocados a académicos e investigadores para el fortalecimiento de las capacidades de gestión, de emprendimiento de equipos de investigación y desarrollo de investigaciones con enfoque a necesidades del entorno.',
          asesoramiento: 'ASESORAMIENTO PARA EL ANÁLISIS DE OPORTUNIDADES DE TRANSFERENCIA TECNOLÓGICA',
          items: [
            'Desarrollo de reportes de vigilancia tecnológica',
            'Análisis de viabilidad técnico-comercial',
            'Desarrollo de propuestas de protección intelectual',
            'Desarrollo de estrategias de transferencia para uso comercial/industrial',
            'Consejería en negociación de contratos de transferencia',
          ],
        },
        {
          title: 'EMPRESAS',
          img: EmpresaImg,
          description: 'Desarrollo de servicios enfocados a empresas industriales, comerciales y de servicios,intesadas en gestionar estratégicamente la vigilancia tecnologíca empresarial e inteligencia competitiva para lograr su identifación como líderes del sector por su enfoque de innovación.',
          asesoramiento: 'ASESORAMIENTO ESTRATEGICO EN GESTIÓN DE LA TRANSFERENCIA TECNOLÓGICA',
          items: [
            'Elaboración de estrategias de protección intelectual',
            'Scouting de tecnologías',
            'Vigilancia tecnológica',
            'Monitoreo de competencia o actores relevantes del sector',
            'Búsqueda del estado de la técnica',
          ],
        },
        {
          title: 'LABORATORIOS',
          img: laboratorioImage,
          description: 'Servicios diseñados para laboratorios académicos, clínicos o de investigación, enfocados en potenciar la gestión del conocimiento, la vigilancia tecnológica y la transferencia de resultados científicos hacia aplicaciones innovadoras.',
          asesoramiento: 'ASESORAMIENTO ESTRATÉGICO PARA LABORATORIOS EN GESTIÓN DE INNOVACIÓN Y TRANSFERENCIA DE CONOCIMIENTO',
          items: [
            'Protección y valorización de resultados de investigación',
            'Mapeo de tecnologías emergentes',
            'Vigilancia científica y tecnológica',
            'Identificación de oportunidades de colaboración o licenciamiento',
            'Búsqueda de antecedentes técnicos y científicos',
          ],
        },
        {
          title: 'MERCADO',
          img: mercadoImage,
          description: 'Aceleramos la conexión entre laboratorios y el mercado, brindando servicios especializados para transformar investigaciones, desarrollos o prototipos en productos viables, competitivos y comercializables. Facilitamos el camino desde la idea hasta su posicionamiento en la industria.',
          asesoramiento: 'ESTRATEGIAS PARA POSICIONAR TU INNOVACIÓN EN EL MERCADO',
          items: [
            'Protección y valorización de resultados de investigación',
            'Estudios de mercado y análisis de viabilidad comercial',
            'Diseño de modelo de negocio y propuesta de valor',
            'Vinculación con aliados estratégicos y fondos de financiamiento',
            'Asesoría para la transferencia, licenciamiento o escalado del producto',
          ],
        },
      ].map((section, index) => (
        <div key={index}>
          <div className="flex flex-col md:flex-row items-center gap-6 w-4/5 mx-auto mt-10">
            <img
              src={section.img}
              alt={section.title}
              className="w-[400px] h-[250px] object-cover rounded-lg border-[5px] border-gray-900"
            />
            <div className="text-lg font-semibold font-montserrat text-gray-800">
              <h2 className="text-2xl mb-2">{section.title}</h2>
              <p className="text-base font-normal">{section.description}</p>
            </div>
          </div>

          <div className="text-center text-base font-semibold font-montserrat text-gray-800 mt-8">
            {section.asesoramiento}
          </div>

          <ul className="list-disc font-montserrat text-gray-700 text-base mt-4 pl-10 max-w-4xl mx-auto">
            {section.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <div className="flex justify-center mt-6">
            <button className="bg-[#66B5CB] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#579fb3] transition-all">
              Contacta con nosotros
            </button>
          </div>

          <div className="border-t-[3px] border-black w-4/5 mx-auto my-8"></div>
        </div>
      ))}
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
    </>
  );
};

<<<<<<< HEAD
export default Revenue;
=======
export default Revenue;
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
