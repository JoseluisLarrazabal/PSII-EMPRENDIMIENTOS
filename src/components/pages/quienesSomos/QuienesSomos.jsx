// src/components/pages/QuienesSomos.jsx
import React from "react";
import HeroBanner from "./HeroBanner";
import MissionStatement from "./MissionStatement";
import CampusLocations from "./CampusLocations";
import UniversityProfile from "./UniversityProfile";
import LocationMap from "./LocationMap"; // Asegúrate de que la ruta sea correcta

const locationData = [
    {
      name: "INCUVALAB - Universidad Univalle",
      address: "Av. América, Cochabamba, Bolivia",
      lat: -17.371345, // NOTA: Estos son valores de ejemplo, deberás reemplazarlos
      lng: -66.158654, // con las coordenadas reales
      rating: 4.5,
      reviewCount: 126,
      type: "Centro de Emprendimiento",
      url: "https://maps.google.com/?cid=123456789", // URL de Google Maps
      iconUrl: "/images/marker-incuvalab.png" // Ícono personalizado del marcador
    }
  ];

  // Acceder a la clave API desde las variables de entorno
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


function QuienesSomos() {
  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner 
        imageSrc="/images/acercaIncuvalab/incuvalab-building.png" 
        title="Bienvenido a INCUVALAB" 
      />
      
      {/* Declaración de misión */}
      <MissionStatement />
      
      {/* Campus y ubicaciones */}
      <CampusLocations />

      {/* Perfil de la Universidad */}
      <UniversityProfile />
      
      {/* Mapa de ubicación */}
      <LocationMap 
        apiKey={googleMapsApiKey}
        locations={locationData}
      />

    </div>
  );
}

export default QuienesSomos;