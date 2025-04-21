// src/pages/Challenger.jsx
import React from "react";
import imp1 from "/semi4.jpeg";         // Evento importante 1
import imp2 from "/semi5.jpg";         // Evento importante 2
import imp3 from "/semi6.jpg";         // Evento importante 3

// Los 3 eventos destacados del mes
const topEvents = [
  {
    id: 1,
    image: imp1,
    title: "INOLVIDABLE CONFERENCIA",
    date: "2025-10-15",
    contact: "info@incubalab.com",
  },
  {
    id: 2,
    image: imp2,
    title: "ENCUENTRO DE INNOVACIÓN",
    date: "2025-10-20",
    contact: "contacto@incubalab.com",
  },
  {
    id: 3,
    image: imp3,
    title: "TALLER DE CREATIVIDAD",
    date: "2025-10-25",
    contact: "soporte@incubalab.com",
  },
];

// Lista de todos los eventos (para el calendario)
const allEvents = [
  {
    id: 1,
    date: "2025-10-02",
    title: "Get Into Your Creative Flow",
    speaker: "Deveeprasad Acharya",
    time: "08:00 - 10:00",
    contact: "registro@incubalab.com",
  },
  {
    id: 2,
    date: "2025-10-03",
    title: "Make Your Dream Trip a Reality",
    speaker: "Dontae Little",
    time: "08:00 - 10:00",
    contact: "registro@incubalab.com",
  },
  {
    id: 3,
    date: "2025-10-05",
    title: "How to Retire Early: The Latte Factor",
    speaker: "Chloé Modibo",
    time: "08:00 - 10:00",
    contact: "registro@incubalab.com",
  },
  {
    id: 4,
    date: "2025-10-07",
    title: "The Power of Body Language",
    speaker: "Jioke Ugoorji",
    time: "08:00 - 10:00",
    contact: "registro@incubalab.com",
  },
  {
    id: 5,
    date: "2025-10-08",
    title: "How Billionaires Master Productivity",
    speaker: "Ren Xue",
    time: "08:00 - 10:00",
    contact: "registro@incubalab.com",
  },
];

// Función para formatear fecha a "OCT 2"
function formatDate(d) {
  const date = new Date(d);
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = date.getDate();
  return { month, day };
}

const Challenger = () => {
  const today = new Date();
  // Filtrar eventos futuros
  const upcoming = allEvents.filter((e) => new Date(e.date) >= today);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Eventos Destacados */}
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold text-[#880043] mb-6">
          Eventos Destacados del Mes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topEvents.map((evt) => (
            <div key={evt.id} className="bg-white rounded-lg overflow-hidden shadow">
              <img
                src={evt.image}
                alt={evt.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-2xl font-bold uppercase text-[#880043]">
                  {evt.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  Fecha: {new Date(evt.date).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-[#8d8d8d] mt-1">
                  Contacto: <a href={`mailto:${evt.contact}`} className="text-[#66b5cb] hover:underline">{evt.contact}</a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Calendario de Eventos */}
      <section className="container mx-auto py-8 px-4">
        <div className="bg-[#66b5cb] p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">
            Próximos Webinars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcoming.map((e) => {
              const { month, day } = formatDate(e.date);
              return (
                <div
                  key={e.id}
                  className="bg-sky-400 text-white p-4 rounded-lg shadow-lg border-l-4 border-white"
                >
                  <div className="text-sm font-bold">{month}</div>
                  <div className="text-3xl font-bold">{day}</div>
                  <h3 className="mt-2 font-semibold">{e.title}</h3>
                  <p className="text-sm mt-1">Speaker: {e.speaker}</p>
                  <p className="text-sm mt-1 flex items-center">
                    🕒 <span className="ml-1">{e.time}</span>
                  </p>
                  <p className="mt-3 text-sm">
                    Contacto:{" "}
                    <a href={`mailto:${e.contact}`} className="underline">
                      {e.contact}
                    </a>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Challenger;
