// src/components/VideoHero.jsx
import React, { useRef, useState } from "react";
import { FaPlay } from "react-icons/fa"; // Necesitarás instalar: npm install react-icons

function VideoHero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const overlayVideoRef = useRef(null);

  // Función para manejar la reproducción del video completo
  const handlePlayVideo = () => {
    if (overlayVideoRef.current) {
      if (!isPlaying) {
        // Abre un modal o reproduce el video completo con sonido
        overlayVideoRef.current.play();
        setIsPlaying(true);
      } else {
        overlayVideoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="relative w-full h-[472px] overflow-hidden">
      {/* Video de fondo en loop, sin sonido y autoplay */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/univalle-campus.mp4" type="video/mp4" />
        {/* Fallback para navegadores que no soportan video */}
        Tu navegador no soporta el elemento de video.
      </video>

      {/* Capa semitransparente para mejorar legibilidad */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>

      {/* Contenido superpuesto */}
      <div className="relative z-10 w-full h-full flex items-center justify-center gap-40 px-8 md:px-16 max-w-[1400px] mx-auto">
        {/* Texto */}
        <div className="max-w-md">
          <h2 className="text-white text-2xl md:text-3xl font-semibold leading-tight">
            "Una institución donde cualquiera puede buscar instrucción en sus
            estudios"
          </h2>
        </div>

        {/* Botón de reproducción */}
        <div className="flex flex-col items-center">
          <button
            onClick={handlePlayVideo}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white bg-opacity-20 border-2 border-white flex items-center justify-center hover:bg-opacity-30 transition-all mb-3"
          >
            <FaPlay className="text-white text-xl ml-1" />
          </button>
          <span className="text-white font-medium tracking-wide text-xs md:text-sm">
            EXPERIENCIA UNIVALLE
          </span>
        </div>
      </div>

      {/* Video overlay para reproducción con sonido (oculto inicialmente) */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute -top-10 right-0 text-white text-xl"
            >
              ✕
            </button>
            <video ref={overlayVideoRef} className="w-full" controls autoPlay>
              <source src="/videos/univalle-campus-full.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoHero;
