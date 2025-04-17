// src/components/pages/QuienesSomos.jsx
import React from "react";
import HeroBanner from "../HeroBanner";
import MissionStatement from "../MissionStatement";
import CampusLocations from "../CampusLocations";
import UniversityProfile from "../UniversityProfile";

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
      
      {/* Campus y ubicaciones */}
      <CampusLocations />

      {/* Perfil de la Universidad */}
      <UniversityProfile />
      
      {/* Contenido principal - lo dejamos como placeholder para futuros componentes */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
        <h1 className="text-3xl font-bold mb-8">Quiénes Somos</h1>
        <p className="text-lg">
          Contenido adicional de Quiénes Somos en construcción.
        </p>
      </div>
    </div>
  );
}

export default QuienesSomos;