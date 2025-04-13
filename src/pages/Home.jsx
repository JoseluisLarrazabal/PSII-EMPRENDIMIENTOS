import React from 'react';
import Card from '../components/Card.jsx'; // Importa el componente Card
import eventImage from '../assets/images/event1.jpg';  // Reemplaza con la ruta de tu imagen
import newsImage from '../assets/images/news1.jpg';   // Reemplaza con la ruta de tu imagen
import mentorImage from '../assets/images/mentor1.jpg'; // Reemplaza con la ruta de tu imagen

const Home = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-100">
      {/* Columna izquierda (más grande) */}
      <div className="col-span-2">
        {/* <h1 className="text-3xl font-bold text-center mb-8">Centro de Emprendimiento Unvalle</h1> */}
        
        {/* Tarjetas (Noticias, Eventos, Mentores) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card 
            image={newsImage} 
            title="Noticias" 
            link="/noticias"
          />
          <Card 
            image={eventImage} 
            title="Eventos" 
            link="/eventos"
          />
          <Card 
            image={mentorImage} 
            title="Mentores" 
            link="/mentores"
          />
        </div>

        {/* Fechas Importantes (Texto superficial) */}
        <div className="border-t pt-4 mt-6">
          <h2 className="text-xl font-semibold mb-2">Fechas Importantes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-lg font-semibold">OCT 14</p>
              <p>Avances y Presentaciones</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-lg font-semibold">MAR 7</p>
              <p>Proyecto “Gestión Automatizada”</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-lg font-semibold">FEB 9</p>
              <p>Seminario de Introducción</p>
            </div>
          </div>
        </div>
      </div>

      {/* Columna derecha (más estrecha) */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Casos de éxito</h2>
        <div className="mb-4">
          <p>“Muchos quisieran liderar, pero no saben lo que es trabajar. No han liderado ni un emprendimiento”</p>
          <p>- Samuel Doria Medina</p>
        </div>
        <div>
          <p>“Siempre luchen por sus sueños, los sacrificios son dolorosos pero triunfa con gloria ese es un emprendimiento”</p>
          <p>- Herbert Vargas</p>
        </div>
        <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Más información</button>
      </div>
    </div>
  );
};

export default Home;
