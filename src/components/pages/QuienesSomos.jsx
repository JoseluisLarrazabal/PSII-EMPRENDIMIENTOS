// src/components/pages/QuienesSomos.jsx
import React from "react";
import HeroBanner from "../HeroBanner";
import MissionStatement from "../MissionStatement"; // Asegúrate de que la ruta sea correcta   

function QuienesSomos() {
  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner 
        imageSrc="/incuvalab-building.png" 
        title="Bienvenido a INCUVALAB" 
      />
      
      {/* Declaración de misión */}
      <MissionStatement />

      {/* Contenido principal */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
        <h1 className="text-3xl font-bold mb-8">Quiénes Somos</h1>
        <p className="text-lg">
          Contenido de Quiénes Somos en construcción. Aquí irán los componentes específicos
          según las capturas de pantalla que me envíes.
        </p>
      </div>
    </div>
  );
}

export default QuienesSomos;