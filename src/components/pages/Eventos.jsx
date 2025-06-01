<<<<<<< HEAD
import { useState, useEffect } from "react";

export default function Eventos() {
  const [eventos, setEventos] = useState({});
  const [meses, setMeses] = useState([]);
  const [mesActivo, setMesActivo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [asistenciasRegistradas, setAsistenciasRegistradas] = useState(new Set());
  const [eventoConfirmado, setEventoConfirmado] = useState(null);
  const [registrandoAsistencia, setRegistrandoAsistencia] = useState(false);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/eventos");
        if (!response.ok) {
          throw new Error('Error al obtener los eventos');
        }
        const data = await response.json();
        
        // Organizar los eventos por mes
        const eventosPorMes = {};
        const mesesUnicos = new Set();
        
        data.forEach((evento, index) => {
          const fecha = new Date(evento.fecha_evento);
          const nombreMes = fecha.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
          
          if (!eventosPorMes[nombreMes]) {
            eventosPorMes[nombreMes] = [];
          }
          
          // Crear un ID único para cada evento usando el índice y la fecha
          const eventoId = `${nombreMes}-${index}-${fecha.getTime()}`;
          
          eventosPorMes[nombreMes].push({
            id: eventoId,
            titulo: evento.titulo,
            lugar: evento.lugar,
            hora: evento.hora,
            descripcion: evento.descripcion,
            fecha: evento.fecha_evento
          });
          
          mesesUnicos.add(nombreMes);
        });
        
        setEventos(eventosPorMes);
        setMeses(Array.from(mesesUnicos));
        
        if (mesesUnicos.size > 0) {
          setMesActivo(Array.from(mesesUnicos)[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const handleAsistencia = async (eventoId, eventoTitulo) => {
    if (!asistenciasRegistradas.has(eventoId)) {
      setRegistrandoAsistencia(true);
      
      // Simulamos una llamada a la API con un retraso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAsistenciasRegistradas(new Set(asistenciasRegistradas).add(eventoId));
      setEventoConfirmado(eventoTitulo);
      setRegistrandoAsistencia(false);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  // Función para obtener los eventos con asistencia registrada por mes
  const getEventosAsistidosPorMes = (mes) => {
    return eventos[mes]?.filter(evento => asistenciasRegistradas.has(evento.id)) || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-5 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Cargando...
            </span>
          </div>
          <p className="mt-2">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-5 flex justify-center items-center">
        <div className="text-center text-red-500">
          <p>Error al cargar los eventos: {error}</p>
        </div>
      </div>
    );
  }

=======
import { useState } from "react";

const eventos = {
  ENERO: [
    {
      titulo: "1. Semana Nacional Ideas en Acción",
      lugar: "Santa Cruz, Bolivia",
      hora: "08:00 a 18:00",
      descripcion: "Espacio de difusión de ideas y de oportunidades.",
    },
    {
      titulo: "2. Taller: De Idea a Producto Mínimo Viable (PMV)",
      lugar: "Virtual",
      hora: "15:00 a 17:00",
      descripcion: "Taller para diseñar tu MVP.",
    },
    {
      titulo: "3. MacroRueda Internacional de Innovación",
      lugar: "Cochabamba, Bolivia",
      hora: "09:00 a 17:00",
      descripcion: "Networking con empresas y startups.",
    },
  ],
  FEBRERO: [
    { titulo: "Evento 1", descripcion: "Descripción del evento 1" },
    { titulo: "Evento 2", descripcion: "Descripción del evento 2" },
    { titulo: "Evento 3", descripcion: "Descripción del evento 3" },
  ],
  MARZO: [
    { titulo: "Evento 1", descripcion: "Descripción del evento 1" },
    { titulo: "Evento 2", descripcion: "Descripción del evento 2" },
    { titulo: "Evento 3", descripcion: "Descripción del evento 3" },
  ],
  ABRIL: [
    { titulo: "Evento 1", descripcion: "Descripción del evento 1" },
    { titulo: "Evento 2", descripcion: "Descripción del evento 2" },
    { titulo: "Evento 3", descripcion: "Descripción del evento 3" },
  ],
  MAYO: [
    { titulo: "Evento 1", descripcion: "Descripción del evento 1" },
    { titulo: "Evento 2", descripcion: "Descripción del evento 2" },
    { titulo: "Evento 3", descripcion: "Descripción del evento 3" },
  ],
  JUNIO: [
    { titulo: "Evento 1", descripcion: "Descripción del evento 1" },
    { titulo: "Evento 2", descripcion: "Descripción del evento 2" },
    { titulo: "Evento 3", descripcion: "Descripción del evento 3" },
  ],
  JULIO: [
    { titulo: "Evento 1", descripcion: "Descripción del evento 1" },
    { titulo: "Evento 2", descripcion: "Descripción del evento 2" },
    { titulo: "Evento 3", descripcion: "Descripción del evento 3" },
  ],
  AGOSTO: [
    { titulo: "Evento 1", descripcion: "Descripción del evento 1" },
    { titulo: "Evento 2", descripcion: "Descripción del evento 2" },
    { titulo: "Evento 3", descripcion: "Descripción del evento 3" },
  ],
  SEPTIEMBRE: [
    { titulo: "Evento 1", descripcion: "Descripción del evento 1" },
    { titulo: "Evento 2", descripcion: "Descripción del evento 2" },
    { titulo: "Evento 3", descripcion: "Descripción del evento 3" },
  ],
  OCTUBRE: [
    { titulo: "Evento 1", descripcion: "Descripción del evento 1" },
    { titulo: "Evento 2", descripcion: "Descripción del evento 2" },
    { titulo: "Evento 3", descripcion: "Descripción del evento 3" },
  ],
  NOVIEMBRE: [
    { titulo: "Evento 1", descripcion: "Descripción del evento 1" },
    { titulo: "Evento 2", descripcion: "Descripción del evento 2" },
    { titulo: "Evento 3", descripcion: "Descripción del evento 3" },
  ],
  DICIEMBRE: [
    { titulo: "Evento 1", descripcion: "Descripción del evento 1" },
    { titulo: "Evento 2", descripcion: "Descripción del evento 2" },
    { titulo: "Evento 3", descripcion: "Descripción del evento 3" },
  ],
  
};

const meses = Object.keys(eventos);

export default function Eventos() {
  const [mesActivo, setMesActivo] = useState("ENERO");
  const [showModal, setShowModal] = useState(false); 

  const handleAsistencia = () => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000); 
  };

>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
  return (
    <div className="min-h-screen bg-gray-100 p-5 flex flex-col lg:flex-row gap-6">
      {/* Columna de meses */}
      <div className="w-full lg:w-1/2 px-10">
<<<<<<< HEAD
        <h2 className="text-3xl font-bold text-center mb-8">EVENTOS 2025</h2>
        <div className="relative w-full max-w-3xl mx-auto">
          {/* Línea central */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-6 bg-cyan-500 rounded"></div>
          
          {/* Eventos alternados */}
          {meses.map((mes, index) => (
            <div
              key={mes}
              className={`w-full flex ${index % 2 === 0 ? "justify-start pr-8" : "justify-end pl-8"} mb-10 relative`}
            >
              <div
                className={`bg-gray-200 p-4 rounded-md w-52 cursor-pointer hover:bg-cyan-200 ${mesActivo === mes ? 'ring-2 ring-cyan-500' : ''} ${
                  getEventosAsistidosPorMes(mes).length > 0 ? 'border-l-4 border-green-500' : ''
                }`}
                onClick={() => setMesActivo(mes)}
              >
                <div className="font-bold text-sm mb-1">{mes}</div>
                <div className="text-xs">
                  {eventos[mes]?.slice(0, 3).map((evento, idx) => (
                    <div key={idx}>{evento.titulo}</div>
                  ))}
                </div>
                {getEventosAsistidosPorMes(mes).length > 0 && (
                  <div className="text-green-600 text-xs mt-1">
                    <p className="font-semibold">Asistencias registradas:</p>
                    {getEventosAsistidosPorMes(mes).map((evento, idx) => (
                      <p key={idx} className="truncate">✓ {evento.titulo}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
=======
      <h2 className="text-3xl font-bold text-center mb-8">EVENTOS 2025</h2>
  <div className="relative w-full max-w-3xl mx-auto">


    {/* Línea central */}
    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-6 bg-cyan-500 rounded"></div>
 {/* Eventos alternados */}
 {meses.map((mes, index) => (
      <div
        key={mes}
        className={`w-full flex ${index % 2 === 0 ? "justify-start pr-8" : "justify-end pl-8"} mb-10 relative`}
      >
        <div
          className="bg-gray-200 p-4 rounded-md w-52 cursor-pointer hover:bg-cyan-200"
          onClick={() => setMesActivo(mes)}
        >
          <div className="font-bold text-sm mb-1">{mes}</div>
          <div className="text-xs">
            EVENTO 1<br />
            EVENTO 2<br />
            EVENTO 3
          </div>
        </div>
      </div>
    ))}
  </div>
</div>



>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf

      {/* Información de eventos */}
      <div className="w-full lg:w-2/3 bg-[#880043] shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">INFORMACION DE LOS EVENTOS</h2>
<<<<<<< HEAD
        {mesActivo && (
          <>
            <h3 className="text-xl font-bold text-white mb-4">{mesActivo}</h3>
            <div className="space-y-6">
              {eventos[mesActivo]?.map((evento, idx) => (
                <div key={idx} style={{ backgroundColor: '#880043' }} className="text-white p-4 rounded-lg">
                  <h4 className="font-bold mb-1">{evento.titulo}</h4>
                  {evento.fecha && <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString('es-ES')}</p>}
                  {evento.lugar && <p><strong>Lugar:</strong> {evento.lugar}</p>}
                  {evento.hora && <p><strong>Hora:</strong> {evento.hora}</p>}
                  <p>{evento.descripcion}</p>
                  <button 
                    className={`mt-3 px-4 py-2 text-white rounded flex items-center justify-center min-w-40 ${
                      asistenciasRegistradas.has(evento.id) 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-cyan-500 hover:bg-cyan-600'
                    }`} 
                    onClick={() => handleAsistencia(evento.id, evento.titulo)}
                    disabled={asistenciasRegistradas.has(evento.id) || registrandoAsistencia}
                  >
                    {registrandoAsistencia && asistenciasRegistradas.has(evento.id) === false ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </>
                    ) : asistenciasRegistradas.has(evento.id) ? (
                      'ASISTENCIA YA REGISTRADA'
                    ) : (
                      'REGISTRAR ASISTENCIA'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-green-700">¡Asistencia registrada con éxito!</h2>
            <p className="text-gray-700 mb-4">Has confirmado tu asistencia al evento:</p>
            <p className="font-semibold text-lg text-gray-900 mb-4">"{eventoConfirmado}"</p>
            <p className="text-gray-600">Gracias por tu participación.</p>
=======
        <h3 className="text-xl font-bold text-white mb-4">{mesActivo}</h3>
        <div className="space-y-6">
          {eventos[mesActivo].map((evento, idx) => (
            <div key={idx} style={{ backgroundColor: '#880043' }} className="text-white p-4 rounded-lg">
              <h4 className="font-bold mb-1">{evento.titulo}</h4>
              {evento.lugar && <p><strong>Lugar:</strong> {evento.lugar}</p>}
              {evento.hora && <p><strong>Hora:</strong> {evento.hora}</p>}
              <p>{evento.descripcion}</p>
              <button className="mt-3 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600" onClick={handleAsistencia}>
                REGISTRAR ASISTENCIA
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2 text-green-700">¡Asistencia registrada!</h2>
            <p>Gracias por confirmar tu participación.</p>
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
          </div>
        </div>
      )}
    </div>
  );
}