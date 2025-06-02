import React from "react";

const VideoPlayer = ({ videoUrl, title }) => {
  // Función para convertir URL de YouTube a formato embed
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    try {
      // Extraer el ID del video de diferentes formatos de URL
      let videoId = null;
      
      // Formato: https://www.youtube.com/watch?v=VIDEO_ID
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
      }
      // Formato: https://youtu.be/VIDEO_ID
      else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split(/[?&]/)[0];
      }
      // Formato: https://youtube.com/embed/VIDEO_ID (ya está en formato embed)
      else if (url.includes('youtube.com/embed/')) {
        return url; // Ya está en el formato correcto
      }
      
      // Si encontramos el ID, devolver la URL de embed
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (error) {
      console.error('Error al procesar URL de YouTube:', error);
    }
    
    return null;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  
  if (!embedUrl) {
    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800">URL de video no válida o no soportada.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <iframe
        width="100%"
        height="400"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;