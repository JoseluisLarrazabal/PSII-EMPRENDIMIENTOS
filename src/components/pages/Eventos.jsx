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

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex flex-col lg:flex-row gap-6">
      {/* Columna de meses */}
      <div className="w-full lg:w-1/2 px-10">
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




      {/* Información de eventos */}
      <div className="w-full lg:w-2/3 bg-[#880043] shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">INFORMACION DE LOS EVENTOS</h2>
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
          </div>
        </div>
      )}
    </div>
  );
}