// components/SuccessStories.jsx
import React from 'react';

const SuccessStories = () => {
  // Buena práctica: Mantener los datos separados de la lógica de presentación
  const stories = [
    {
      id: 1, // Siempre es bueno tener IDs únicos
      author: "Samuel Doria Medina",
      quote: "Muchos quisieran liderar, pero no saben lo que es trabajar. No han liderado ni un emprendimiento",
      image: "/samuel.jpeg" // Asegúrate de tener la imagen en la carpeta correcta
    },
    {
      id: 2,
      author: "Herbert Vargas",
      quote: "Siempre luchen por sus sueños, los sacrificios son dolorosos pero triunfa con gloria ese es un emprendimiento",
      image: "/herbert.jpeg"
    }
  ];

  // Componente interno para cada testimonio
  // Buena práctica: Separar en subcomponentes para mejor mantenibilidad
  const TestimonialCard = ({ author, quote, image }) => (
    <div className="flex items-start space-x-4 mb-6">
      <img 
        src={image} 
        alt={author} 
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <p className="text-gray-800 mb-2">{quote}</p>
        <p className="text-[#8B0D37] font-medium">• {author}</p>
      </div>
    </div>
  );

  return (
    <div>
      {/* Encabezado con línea superior */}
      <div className="border-t-2 border-[#8B0D37]">
        <h2 className="text-2xl font-bold mt-4">Casos de éxito</h2>
      </div>
      
      {/* Testimonios */}
      <div className="mt-8 space-y-8">
        {stories.map((story) => (
          <div key={story.id} className="flex items-start gap-4">
            <img 
              src={story.image} 
              alt={story.author}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <p className="text-gray-800 text-sm leading-relaxed mb-1">
                {story.quote}
              </p>
              <p className="text-[#8B0D37] text-sm">• {story.author}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botón */}
      <button className="mt-8 bg-[#8B0D37] text-white px-6 py-2 rounded text-sm hover:bg-[#6B0A2A] transition-colors">
        Más información
      </button>
    </div>
  );
};

export default SuccessStories;