// src/pages/Challenger.jsx
import React, { useState, useEffect } from "react";

function formatDate(d) {
  const date = new Date(d);
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = date.getDate();
  return { month, day };
}

const Challenger = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/challenger")
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando eventos...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const topEvents = events.filter(e => e.destacado).slice(0, 3);
  const today = new Date();
  const upcoming = events
    .filter(e => new Date(e.fecha) >= today)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold text-[#880043] mb-6">Eventos Destacados del Mes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topEvents.map(evt => (
            <div key={evt.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
              <img
                src={evt.image_url}
                alt={evt.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-2xl font-bold uppercase text-[#880043]">{evt.title}</h3>
                <p className="text-gray-600 mt-2">
                  Fecha: {new Date(evt.fecha).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-[#8d8d8d] mt-1">
                  Contacto: <a href={`mailto:${evt.contacto_email}`} className="text-[#66b5cb] hover:underline">{evt.contacto_email}</a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className="container mx-auto py-8 px-4">
        <div className="bg-[#66b5cb] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Próximos Eventos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcoming.map(e => {
              const { month, day } = formatDate(e.fecha);
              return (
                <div key={e.id} className="bg-[#66b5cb] text-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow border-l-4 border-white">
                  <div className="text-sm font-bold">{month} {day}</div>
                  <div className="mt-2 font-semibold text-lg">{e.title}</div>
                  <p className="text-sm mt-1">Hora: {e.hora_inicio} - {e.hora_fin}</p>
                  <p className="mt-3 text-sm">
                    Contacto: <a href={`mailto:${e.contacto_email}`} className="underline">{e.contacto_email}</a>
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
