import React, { useState } from "react";

// Estructura inicial de un slide vacío
const emptySlide = {
  title: "",
  content: "",
  videoUrl: "",
  quiz: [],
  resources: [],
};

const CourseBuilder = () => {
  const [slides, setSlides] = useState([{ ...emptySlide }]);
  const [selectedSlide, setSelectedSlide] = useState(0);

  // Funciones para agregar, eliminar y actualizar slides
  const addSlide = () => {
    setSlides([...slides, { ...emptySlide }]);
    setSelectedSlide(slides.length);
  };

  const removeSlide = (idx) => {
    if (slides.length === 1) return;
    const newSlides = slides.filter((_, i) => i !== idx);
    setSlides(newSlides);
    setSelectedSlide(Math.max(0, idx - 1));
  };

  const updateSlide = (field, value) => {
    const newSlides = slides.map((slide, idx) =>
      idx === selectedSlide ? { ...slide, [field]: value } : slide
    );
    setSlides(newSlides);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar de slides */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="font-bold mb-4 text-[#8B0D37] text-lg">Lecciones</h2>
        <ul>
          {slides.map((slide, idx) => (
            <li key={idx} className="mb-2">
              <button
                className={`block w-full text-left px-2 py-2 rounded ${
                  idx === selectedSlide ? "bg-[#8B0D37] text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedSlide(idx)}
              >
                {slide.title || `Lección ${idx + 1}`}
              </button>
              {slides.length > 1 && (
                <button
                  className="ml-2 text-xs text-red-600"
                  onClick={() => removeSlide(idx)}
                  title="Eliminar lección"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 px-4 py-2 bg-[#8B0D37] text-white rounded w-full"
          onClick={addSlide}
        >
          + Agregar lección
        </button>
      </aside>

      {/* Editor de slide */}
      <main className="flex-1 p-8">
        <h3 className="text-xl font-bold mb-4">Editar lección</h3>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Título</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={slides[selectedSlide].title}
            onChange={(e) => updateSlide("title", e.target.value)}
            placeholder="Título de la lección"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Contenido</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={slides[selectedSlide].content}
            onChange={(e) => updateSlide("content", e.target.value)}
            placeholder="Contenido textual o instrucciones"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Video de YouTube (opcional)</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={slides[selectedSlide].videoUrl}
            onChange={(e) => updateSlide("videoUrl", e.target.value)}
            placeholder="URL de YouTube"
          />
        </div>
        {/* Editor de Quiz */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Quiz (opcional)</label>
          {slides[selectedSlide].quiz.map((q, qIdx) => (
            <div key={qIdx} className="border rounded p-3 mb-3 bg-gray-50">
              <input
                className="w-full border rounded px-2 py-1 mb-2"
                value={q.question}
                onChange={(e) => {
                  const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                    idx === qIdx ? { ...item, question: e.target.value } : item
                  );
                  updateSlide("quiz", quiz);
                }}
                placeholder={`Pregunta ${qIdx + 1}`}
              />
              <div className="mb-2">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center mb-1">
                    <input
                      className="flex-1 border rounded px-2 py-1"
                      value={opt}
                      onChange={(e) => {
                        const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                          idx === qIdx
                            ? {
                                ...item,
                                options: item.options.map((o, oi) =>
                                  oi === oIdx ? e.target.value : o
                                ),
                              }
                            : item
                        );
                        updateSlide("quiz", quiz);
                      }}
                      placeholder={`Opción ${oIdx + 1}`}
                    />
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      className="ml-2"
                      checked={q.answer === oIdx}
                      onChange={() => {
                        const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                          idx === qIdx ? { ...item, answer: oIdx } : item
                        );
                        updateSlide("quiz", quiz);
                      }}
                      title="Marcar como correcta"
                    />
                    <span className="ml-1 text-xs text-green-700">Correcta</span>
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        className="ml-2 text-xs text-red-600"
                        onClick={() => {
                          const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                            idx === qIdx
                              ? {
                                  ...item,
                                  options: item.options.filter((_, oi) => oi !== oIdx),
                                  answer:
                                    item.answer === oIdx
                                      ? 0
                                      : item.answer > oIdx
                                      ? item.answer - 1
                                      : item.answer,
                                }
                              : item
                          );
                          updateSlide("quiz", quiz);
                        }}
                        title="Eliminar opción"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-1 text-xs text-[#8B0D37] underline"
                  onClick={() => {
                    const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                      idx === qIdx
                        ? { ...item, options: [...item.options, ""] }
                        : item
                    );
                    updateSlide("quiz", quiz);
                  }}
                >
                  + Agregar opción
                </button>
              </div>
              <button
                type="button"
                className="text-xs text-red-600"
                onClick={() => {
                  const quiz = slides[selectedSlide].quiz.filter((_, idx) => idx !== qIdx);
                  updateSlide("quiz", quiz);
                }}
              >
                Eliminar pregunta
              </button>
            </div>
          ))}
          <button
            type="button"
            className="px-3 py-1 bg-[#8B0D37] text-white rounded text-sm"
            onClick={() => {
              const quiz = [
                ...slides[selectedSlide].quiz,
                { question: "", options: ["", ""], answer: 0 },
              ];
              updateSlide("quiz", quiz);
            }}
          >
            + Agregar pregunta
          </button>
        </div>
        {/* Editor de Recursos */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Recursos para descargar (opcional)</label>
          {slides[selectedSlide].resources.map((res, rIdx) => (
            <div key={rIdx} className="flex items-center mb-2">
              <input
                className="flex-1 border rounded px-2 py-1 mr-2"
                value={res.name}
                onChange={(e) => {
                  const resources = slides[selectedSlide].resources.map((item, idx) =>
                    idx === rIdx ? { ...item, name: e.target.value } : item
                  );
                  updateSlide("resources", resources);
                }}
                placeholder="Nombre del recurso"
              />
              <input
                className="flex-1 border rounded px-2 py-1 mr-2"
                value={res.url}
                onChange={(e) => {
                  const resources = slides[selectedSlide].resources.map((item, idx) =>
                    idx === rIdx ? { ...item, url: e.target.value } : item
                  );
                  updateSlide("resources", resources);
                }}
                placeholder="URL de descarga"
              />
              <button
                type="button"
                className="text-xs text-red-600"
                onClick={() => {
                  const resources = slides[selectedSlide].resources.filter((_, idx) => idx !== rIdx);
                  updateSlide("resources", resources);
                }}
                title="Eliminar recurso"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="px-3 py-1 bg-[#8B0D37] text-white rounded text-sm"
            onClick={() => {
              const resources = [
                ...slides[selectedSlide].resources,
                { name: "", url: "" },
              ];
              updateSlide("resources", resources);
            }}
          >
            + Agregar recurso
          </button>
        </div>
      </main>
    </div>
  );
};

export default CourseBuilder;