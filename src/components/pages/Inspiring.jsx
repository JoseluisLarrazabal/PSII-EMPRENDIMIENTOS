// src/pages/Inspiring.jsx
import React, { useState, useEffect } from "react";

const Inspiring = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  // Fetch talks from backend
  useEffect(() => {
    fetch("http://localhost:4000/api/inspiring")
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        setTalks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const getEmbedUrl = url => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/.*v=)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  if (loading) return <div className="p-8 text-center">Cargando charlas...</div>;
  if (error)   return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (talks.length === 0) return <div className="p-8 text-center">No hay charlas disponibles.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8 px-4 bg-white">
        <h2 className="text-4xl font-bold text-center text-[#66b5cb] mb-4">Inspiring Talks</h2>
        <p className="text-center text-lg text-[#8d8d8d] mb-12">
          Descubre charlas inspiradoras al estilo TEDx para motivarte y transformar tu visión.
        </p>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {talks.map(talk => (
            <div key={talk.id} className="bg-white shadow-lg rounded-lg overflow-hidden border">
              <img
                src={talk.imagen_url}
                alt={talk.titulo}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-2xl font-bold text-[#880043]">{talk.titulo}</h3>
                <p className="text-sm text-[#8d8d8d] mt-1">por {talk.speaker}</p>
                <p className="text-base text-[#8d8d8d] mt-2">{talk.descripcion}</p>
                <button
                  onClick={() => setSelected(getEmbedUrl(talk.video_url))}
                  className="mt-4 inline-block bg-[#66b5cb] text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors duration-300"
                >Ver charla</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Video Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-screen-xl h-[90vh] bg-black rounded-lg overflow-hidden">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-white text-4xl font-bold z-10"
            >&times;</button>
            <iframe
              src={selected}
              title="Video"
              allow="autoplay; fullscreen"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inspiring;
