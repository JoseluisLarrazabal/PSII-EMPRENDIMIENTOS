import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "../moocs/transitions.css";
import Quiz from "./components/Quiz.jsx";
import Resources from "./components/Resources.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SlideContent from "./components/SlideContent.jsx";
import VideoPlayer from "./components/VideoPlayer.jsx";
import { fetchCourseContent } from '../../../services/api'; // Corregir la importación
import axios from 'axios';

const CourseContent = () => {
  const { courseId } = useParams(); // Agregar esta línea
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalSlides = slides.length;
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  // Reemplazar mockSlides con datos reales
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const content = await fetchCourseContent(courseId);
        setSlides(content);
      } catch (error) {
        console.error("Error loading course content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchContent();
    }
  }, [courseId]);

  // Scroll automático al cambiar de slide
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSlide]);

  if (loading) {
    return <div>Cargando contenido del curso...</div>; // O un spinner/loading component
  }

  const slide = slides[currentSlide];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Botón hamburguesa solo en móvil */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#8B0D37] text-white p-2 rounded"
        onClick={() => setSidebarOpen(true)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar responsivo */}
      <Sidebar
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        className={`fixed top-0 left-0 h-full z-40 bg-white transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      />

      {/* Fondo oscuro al abrir sidebar en móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Área principal */}
      <main className="flex-1 max-w-3xl mx-auto p-4 md:p-8 transition-all duration-300">
        {/* Botón para ver el CourseBuilder (demo) */}
        <div className="flex justify-end mb-4">
          <a
            href="/course-Builder"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#8B0D37] text-white rounded hover:bg-[#6E0B2A] font-semibold"
          >
            Ver panel de creación (CourseBuilder)
          </a>
        </div>
        {/* Encabezado con título y progreso */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#8B0D37] mb-1">{slide.title}</h2>
            <span className="text-sm text-gray-600">
              Lección {currentSlide + 1} de {totalSlides}
            </span>
          </div>
          <div className="w-full sm:w-64 mt-4 sm:mt-0">
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-[#8B0D37] rounded transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{Math.round(progress)}% completado</span>
          </div>
        </div>

        {/* Video */}
        <div className="mb-8 shadow rounded bg-white">
          <VideoPlayer videoUrl={slide.videoUrl} title={slide.title} />
        </div>

        {/* Contenido */}
        <div className="mb-8 shadow rounded bg-white p-6">
          <SlideContent title={slide.title} content={slide.content} />
        </div>

        {/* Quiz */}
        <div className="mb-8 shadow rounded bg-white p-6">
          <h4 className="font-semibold mb-2">Quiz</h4>
          <Quiz quiz={slide.quiz} />
        </div>

        {/* Recursos */}
        <div className="mb-8 shadow rounded bg-white p-6">
          <Resources resources={slide.resources} />
        </div>

        {/* Navegación entre lecciones */}
        <div className="flex justify-between mt-8">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
          >
            ← Anterior
          </button>
          <button
            className="px-4 py-2 rounded bg-[#8B0D37] text-white font-semibold hover:bg-[#6E0B2A] disabled:opacity-50"
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
            disabled={currentSlide === totalSlides - 1}
          >
            Siguiente →
          </button>
        </div>
      </main>
    </div>
  );
};

export default CourseContent;