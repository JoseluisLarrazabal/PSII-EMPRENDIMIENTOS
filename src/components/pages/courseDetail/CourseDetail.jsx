import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./transitions.css"; // Asumiendo que usas el mismo archivo de transiciones

// Importaremos los servicios API en un paso posterior
// import { getCourseDetail, getRelatedCourses } from "../../../services/api";

// Datos mock para desarrollo inicial
const mockCourseData = {
  id: 1,
  title: "CS50's Introduction to Computer Science",
  provider: "HarvardX",
  school_name: "Harvard University",
  image_url: "https://example.com/course-image.jpg",
  logo_url: "https://example.com/harvard-logo.png",
  description: "This is Harvard University's introduction to the intellectual enterprises of computer science and the art of programming...",
  start_date: "2023-11-15T00:00:00",
  duration: "12 semanas",
  effort_hours: 6,
  language: "Inglés",
  level: "Principiante",
  prerequisites: "No se requieren conocimientos previos de programación.",
  enrollment_count: 2500000,
  rating: 4.8,
  video_preview_url: "https://www.youtube.com/embed/WOvhPzWGGc",
  has_certificate: true,
  // Añadiremos más datos en próximos pasos
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // Estados para datos del curso
  const [courseData, setCourseData] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  
  // Estados para navegación por pestañas
  const [activeTab, setActiveTab] = useState("overview");
  
  // Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para cargar datos del curso
  useEffect(() => {
    // Simulación de carga (reemplazar con API real más adelante)
    setLoading(true);
    setTimeout(() => {
      setCourseData(mockCourseData);
      setLoading(false);
    }, 800);
    
    // Implementaremos la llamada API real en un paso posterior
  }, [courseId]);

  // Renderizado de estados de carga/error
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-red-50 p-6 rounded-lg max-w-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error al cargar el curso</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
          >
            Volver a cursos
          </button>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-yellow-50 p-6 rounded-lg max-w-lg">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">Curso no encontrado</h2>
          <p className="text-yellow-600 mb-4">No pudimos encontrar el curso que estás buscando.</p>
          <button 
            onClick={() => navigate("/moocs")} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
          >
            Explorar cursos disponibles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 fade-in">
      {/* Contenedor principal */}
      <div className="flex flex-col">
        {/* Banner hero y componentes principales irán aquí */}
        <p className="p-4 text-center">Aquí irá el contenido del curso ID: {courseId}</p>
      </div>
    </div>
  );
};

export default CourseDetail;