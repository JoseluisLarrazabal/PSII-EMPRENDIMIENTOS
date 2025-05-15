import React, { useState } from "react";

// Estructura inicial de un slide vacío
const emptySlide = {
  title: "",
  content: "",
  videoUrl: "",
  embedUrl: "",
  quiz: [],
  resources: [],
};

// Validación simple al intentar guardar
const validateEmbedUrl = (url) => {
  if (!url) return true; // Campo opcional
  // Ejemplo: Google Slides, Canva, PowerPoint Online (puedes agregar más patrones)
  const patterns = [
    /^https:\/\/docs\.google\.com\/presentation\/d\/e\/.+\/embed\?start=/,
    /^https:\/\/www\.canva\.com\/design\/.+\/view\?embed/,
    /^https:\/\/onedrive\.live\.com\/embed\?resid=.+/,
  ];
  return patterns.some((regex) => regex.test(url));
};

const validateSlide = (slide) => {
  const errs = {};
  if (!slide.title.trim()) errs.title = "El título es obligatorio.";
  if (slide.embedUrl && !validateEmbedUrl(slide.embedUrl)) {
    errs.embedUrl = "El enlace de inserción no es válido. Usa el enlace de 'insertar' de Google Slides, Canva o PowerPoint Online.";
  }
  slide.quiz.forEach((q, idx) => {
    if (!q.question.trim()) errs[`quiz-q${idx}`] = "La pregunta es obligatoria.";
    if (q.options.length < 2) errs[`quiz-opt${idx}`] = "Debe haber al menos 2 opciones.";
    if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.options.length) {
      errs[`quiz-ans${idx}`] = "Debe marcar una respuesta correcta.";
    }
  });
  slide.resources.forEach((r, idx) => {
    if ((r.name && !r.url) || (!r.name && r.url)) {
      errs[`res${idx}`] = "Completa ambos campos del recurso.";
    }
  });
  return errs;
};

const CourseBuilder = () => {
  const [slides, setSlides] = useState([{ ...emptySlide }]);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [errors, setErrors] = useState({});

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

  const handleSave = () => {
    const errs = validateSlide(slides[selectedSlide]);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      alert("¡Lección válida y lista para guardar!");
      // Aquí iría la lógica de guardado real
    }
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
        <div className="flex justify-end mb-4">
          <button
            className="px-4 py-2 bg-[#8B0D37] text-white rounded font-semibold"
            onClick={handleSave}
          >
            Guardar lección (demo)
          </button>
        </div>
        <h3 className="text-xl font-bold mb-4">Editar lección</h3>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Título</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={slides[selectedSlide].title}
            onChange={(e) => updateSlide("title", e.target.value)}
            placeholder="Título de la lección"
          />
          {errors.title && <span className="text-red-600 text-sm">{errors.title}</span>}
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
        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Enlace de presentación embebida (opcional)
            <span className="block text-xs text-gray-500">
              Pega aquí el enlace de inserción de Google Slides, Canva, PowerPoint Online, etc.
            </span>
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={slides[selectedSlide].embedUrl || ""}
            onChange={e => updateSlide("embedUrl", e.target.value)}
            placeholder="https://docs.google.com/presentation/d/e/..."
          />
          {errors.embedUrl && (
            <span className="text-red-600 text-sm">{errors.embedUrl}</span>
          )}
        </div>
        {slides[selectedSlide].embedUrl && (
          <div className="mb-8 shadow rounded bg-white p-4">
            <iframe
              src={slides[selectedSlide].embedUrl}
              title="Presentación embebida"
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
              className="rounded"
            ></iframe>
          </div>
        )}
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
              {errors[`quiz-q${qIdx}`] && (
                <span className="text-red-600 text-sm">{errors[`quiz-q${qIdx}`]}</span>
              )}
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
                {errors[`quiz-opt${qIdx}`] && (
                  <span className="text-red-600 text-sm">{errors[`quiz-opt${qIdx}`]}</span>
                )}
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
              {errors[`quiz-ans${qIdx}`] && (
                <span className="text-red-600 text-sm">{errors[`quiz-ans${qIdx}`]}</span>
              )}
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
              {errors[`res${rIdx}`] && (
                <span className="text-red-600 text-sm">{errors[`res${rIdx}`]}</span>
              )}
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