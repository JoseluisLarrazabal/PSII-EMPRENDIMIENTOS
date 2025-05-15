import React, { useState } from "react";
import "../../pages/moocs/transitions.css";
import Quiz from "./components/Quiz.jsx";
import Resources from "./components/Resources.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SlideContent from "./components/SlideContent.jsx";
import VideoPlayer from "./components/VideoPlayer.jsx";

// Simulación de slides/lecciones del curso
const mockSlides = [
  {
    id: 1,
    title: "Introducción al curso",
    videoUrl: "https://www.youtube.com/embed/WOvhPzWGGc",
    content: "Bienvenido a la primera lección. Aquí aprenderás los conceptos básicos...",
    quiz: [
      {
        question: "¿Qué es la programación?",
        options: ["Arte", "Ciencia", "Ambas", "Ninguna"],
        answer: 2,
      },
    ],
    resources: [
      { name: "Guía de inicio", url: "#" },
      { name: "Presentación PDF", url: "#" },
    ],
  },
  // Puedes agregar más slides simuladas aquí
];

const CourseContent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = mockSlides[currentSlide];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Menú lateral */}
      <Sidebar
        slides={mockSlides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />

      {/* Área principal */}
      <main className="flex-1 p-8">
        {/* Video */}
        <div className="mb-6">
          <VideoPlayer videoUrl={slide.videoUrl} title={slide.title} />
        </div>

        {/* Contenido */}
        <div className="mb-6">
          <SlideContent title={slide.title} content={slide.content} />
        </div>

        {/* Quiz */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Quiz</h4>
          <Quiz quiz={slide.quiz} />
        </div>

        {/* Recursos */}
        <div>
          <h4 className="font-semibold mb-2">Recursos para descargar</h4>
          <Resources resources={slide.resources} />
        </div>
      </main>
    </div>
  );
};

export default CourseContent;