// src/pages/Inspiring.jsx
import React from "react";
import logo from "../assets/images/Logo 1.png"; // Ajusta la ruta del logo
import semi1 from "../assets/images/semi1.jpg";
import semi2 from "../assets/images/semi2.jpg";
import semi3 from "../assets/images/semi3.jpg";

// Datos de ejemplo para las charlas
const inspiringTalks = [
  {
    id: 1,
    title: "La Innovación Revolucionaria",
    speaker: "John Doe",
    description: "Explora nuevas fronteras en innovación que transformarán nuestro futuro.",
    image: semi1,
  },
  {
    id: 2,
    title: "Rompiendo Barreras",
    speaker: "Jane Smith",
    description: "Una mirada inspiradora sobre cómo superar obstáculos y alcanzar el éxito.",
    image: semi2,
  },
  {
    id: 3,
    title: "Colaboración y Creatividad",
    speaker: "Carlos Ramirez",
    description: "Descubre cómo la unión de ideas puede cambiar el mundo.",
    image: semi3,
  },
];

const Inspiring = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Banner Superior (color guindo) */}
      <div className="bg-[#880043] py-4">
        <h1 className="text-white text-left text-2xl font-bold">
          CENTRO DE EMPRENDIMIENTO UNIVALLE
        </h1>
      </div>

      {/* Navbar (fondo blanco) */}
      <nav className="bg-white">
        <div className="container mx-auto flex items-center justify-between py-2 px-4">
          {/* Logo a la izquierda */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="INCUVALAB" className="h-20" />
          </div>
          {/* Menú de enlaces a la derecha */}
          <ul className="flex space-x-6 text-sm font-semibold">
            <li>
              <a
                href="#"
                className="text-gray-700 hover:underline"              >
                Acerca de nosotros
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:underline">
                Nuestros servicios
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:underline">
                Crowd Funding
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:underline">
                Apoyo a emprendedor
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:underline">
                Postulaciones
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="container mx-auto py-8 px-4 bg-white">
        <h2 className="text-4xl font-bold text-center text-[#66b5cb] mb-4">
          Inspiring Talks
        </h2>
        <p className="text-center text-lg text-[#8d8d8d] mb-12">
          Descubre charlas inspiradoras al estilo TEDx para motivarte y transformar tu visión.
        </p>

        {/* Grid de Tarjetas */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {inspiringTalks.map((talk) => (
            <div
              key={talk.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden border"
            >
              <img
                src={talk.image}
                alt={talk.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-2xl font-bold text-[#880043]">
                  {talk.title}
                </h3>
                <p className="text-sm text-[#8d8d8d] mt-1">
                  por {talk.speaker}
                </p>
                <p className="text-base text-[#8d8d8d] mt-2">
                  {talk.description}
                </p>
                <a
                  href="#"
                  className="mt-4 inline-block bg-[#66b5cb] text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors duration-300"
                >
                  Ver charla
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#880043] py-4 mt-12">
        <div className="container mx-auto text-center text-white">
          &copy; {new Date().getFullYear()} Inspiring Talks. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Inspiring;
