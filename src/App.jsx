import { useState } from "react";

const events = Array.from({ length: 70 }, (_, i) => ({
  id: i + 1,
  title: `Evento ${i + 1}`,
  date: new Date(2025, Math.floor(i / (i < 25 ? 15 : 25)), (i % (i < 25 ? 15 : 25)) + 1).toISOString().split('T')[0],
  details: `Detalles del evento ${i + 1}`
}));

function Calendar({ onSelect }) {
  const [currentMonth, setCurrentMonth] = useState(3);

  const filteredEvents = events.filter(event => new Date(event.date).getMonth() === currentMonth);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-gray-400">
      <div className="flex justify-between items-center mb-4">
        <button className="text-xl" onClick={() => setCurrentMonth(prev => Math.max(0, prev - 1))}>&#9664;</button>
        <h2 className="text-2xl font-bold text-[#66b5cb] text-center">
          {new Date(2025, currentMonth).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </h2>
        <button className="text-xl" onClick={() => setCurrentMonth(prev => Math.min(11, prev + 1))}>&#9654;</button>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {filteredEvents.map(event => (
          <div 
            key={event.id} 
            className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-center cursor-pointer hover:bg-[#66b5cb] hover:text-white"
            onClick={() => onSelect(event)}
          >
            <p className="text-lg font-semibold">{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-sm mt-2">{event.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventDetail({ event, onClose }) {
  const [registered, setRegistered] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 max-w-lg bg-white rounded-xl shadow-md border border-gray-400">
        <h2 className="text-2xl font-bold text-[#66b5cb]">{event.title}</h2>
        <p className="text-lg text-[#880043]">{new Date(event.date).toLocaleDateString()}</p>
        <p className="mt-4 text-gray-600 text-lg">{event.details}</p>
        <button 
          className={`mt-6 px-6 py-3 rounded text-white text-lg ${registered ? 'bg-gray-500' : 'bg-[#880043] hover:bg-[#66b5cb]'}`} 
          onClick={() => setRegistered(true)}
          disabled={registered}
        >
          {registered ? "Asistencia Registrada" : "Registrar Asistencia"}
        </button>
        <button className="mt-4 ml-4 px-6 py-3 bg-gray-400 text-white rounded text-lg hover:bg-gray-500" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="min-h-screen bg-[#8d8d8d] flex flex-col items-center p-12">
      <Calendar onSelect={setSelectedEvent} />
      {selectedEvent && <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}