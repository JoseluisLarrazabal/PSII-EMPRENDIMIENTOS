// src/components/LocationMap.jsx
import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const LocationMap = ({ apiKey, locations }) => {
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  
  // Centro del mapa (se puede calcular dinámicamente si hay múltiples ubicaciones)
  const mapCenter = locations.length > 0 
    ? { lat: locations[0].lat, lng: locations[0].lng }
    : { lat: -16.5, lng: -68.15 }; // Coordenadas por defecto (La Paz, Bolivia)
  
  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '8px',
    overflow: 'hidden'
  };
  
  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12">
        <h2 className="text-[#8B0D37] text-2xl font-bold mb-8">Mapas de ubicación y direcciones</h2>
        
        <div className="shadow-lg">
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={15}
              options={options}
            >
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={{ lat: location.lat, lng: location.lng }}
                  onClick={() => setSelectedLocation(location)}
                  icon={{
                    url: location.iconUrl || '/images/marker-incuvalab.png',
                    scaledSize: { width: 40, height: 40 }
                  }}
                />
              ))}
              
              {selectedLocation && (
                <InfoWindow
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
                    <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                    {selectedLocation.rating && (
                      <div className="flex items-center mt-1">
                        <span className="text-sm font-semibold mr-1">{selectedLocation.rating}</span>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(selectedLocation.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({selectedLocation.reviewCount})</span>
                      </div>
                    )}
                    {selectedLocation.type && (
                      <p className="text-xs text-gray-500 mt-1">{selectedLocation.type}</p>
                    )}
                    {selectedLocation.url && (
                      <a 
                        href={selectedLocation.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 block"
                      >
                        Ver en Google Maps
                      </a>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;