import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createCourse, fetchCourseById, fetchSlidesByCourseId, updateCourse } from "../../../services/api";

// Estructura inicial de un slide vacío
const emptySlide = {
  title: "",
  content: "",
  videoUrl: "",
  embedUrl: "",
  quiz: [],
  resources: [],
};

// Estructura inicial para el curso
const emptyCourse = {
  title: "",
  provider: "",
  image_url: "",
  logo_url: "",
  type: "",
  course_count: "",
  category: "",
  is_popular: false,
  is_new: false,
  is_trending: false,
  school_id: "",
  administrador_id: "",
  description: "",
  start_date: "",
  duration: "",
  effort_hours: "",
  language: "",
  level: "",
  prerequisites: "",
  enrollment_count: "",
  rating: "",
  video_preview_url: "",
  has_certificate: false,
  subjects: [],
};

// Validación simple al intentar guardar
const validateEmbedUrl = (url) => {
  if (!url) return true; // Campo opcional
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

// Utilidad para formatear la fecha a yyyy-MM-dd
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const CourseBuilder = () => {
  const [course, setCourse] = useState({ ...emptyCourse });
  const [slides, setSlides] = useState([{ ...emptySlide }]);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get("id");

  // Cargar datos si es edición
  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;
      setIsEdit(true);
      try {
        const data = await fetchCourseById(courseId);
        setCourse({ ...emptyCourse, ...data });
        const slidesData = await fetchSlidesByCourseId(courseId);
        setSlides(slidesData.length > 0 ? slidesData : [{ ...emptySlide }]);
        setSelectedSlide(0);
      } catch (err) {
        alert("Error al cargar el curso para edición");
        navigate("/mis-cursos");
      }
    };
    loadCourse();
    // eslint-disable-next-line
  }, [courseId]);

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

  // Guardar todo el curso y sus slides
  const handleSaveCourse = async () => {
    // Validación básica de campos obligatorios del curso
    if (!course.title || !course.provider || !course.image_url || !course.logo_url || !course.type || !course.category) {
      alert("Completa todos los campos obligatorios del curso.");
      return;
    }
    // Validar todas las slides
    for (let i = 0; i < slides.length; i++) {
      const errs = validateSlide(slides[i]);
      if (Object.keys(errs).length > 0) {
        setSelectedSlide(i);
        setErrors(errs);
        alert(`Corrige los errores en la lección ${i + 1} antes de guardar el curso.`);
        return;
      }
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      // Formatear la fecha antes de enviar
      let startDate = course.start_date;
      if (startDate && startDate.includes("T")) {
        startDate = startDate.split("T")[0];
      }
      const courseToSave = { ...course, slides, start_date: startDate };
      let response;
      if (isEdit && courseId) {
        response = await updateCourse(courseId, courseToSave, token);
        alert("Curso actualizado exitosamente");
      } else {
        response = await createCourse(courseToSave, token);
        alert("Curso creado exitosamente con ID: " + response.data.id);
      }
      navigate("/mis-cursos");
    } catch (error) {
      alert("Error al guardar el curso: " + (error.response?.data?.message || error.message));
    }
    setSaving(false);
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

      {/* Panel principal */}
      <main className="flex-1 p-8">
        {isEdit && (
          <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
            <strong>Modo edición:</strong> Estás editando un curso existente.
          </div>
        )}
        {/* Editor de slide */}
        <h3 className="text-xl font-bold mb-4">Editar lección</h3>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Título</label>
          <input
            className={`w-full border rounded px-3 py-2 ${errors.title ? 'border-red-500' : ''}`}
            value={slides[selectedSlide].title || ""}
            onChange={(e) => updateSlide("title", e.target.value)}
            placeholder="Título de la lección"
          />
          {errors.title && <span className="text-red-600 text-sm">{errors.title}</span>}
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Contenido</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={slides[selectedSlide].content || ""}
            onChange={(e) => updateSlide("content", e.target.value)}
            placeholder="Contenido textual o instrucciones"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Video de YouTube (opcional)</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={slides[selectedSlide].videoUrl || ""}
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
                value={q.question || ""}
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
                      value={opt || ""}
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
                value={res.name || ""}
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
                value={res.url || ""}
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

        {/* Datos generales del curso */}
        <div className="mt-12 bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-4">Datos generales del curso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Título *</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={course.title || ""}
                onChange={e => setCourse({ ...course, title: e.target.value })}
                placeholder="Título del curso"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Proveedor *</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={course.provider || ""}
                onChange={e => setCourse({ ...course, provider: e.target.value })}
                placeholder="Proveedor"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Imagen (URL) *</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={course.image_url || ""}
                onChange={e => setCourse({ ...course, image_url: e.target.value })}
                placeholder="URL de la imagen"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Logo (URL) *</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={course.logo_url || ""}
                onChange={e => setCourse({ ...course, logo_url: e.target.value })}
                placeholder="URL del logo"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Tipo *</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={course.type || ""}
                onChange={e => setCourse({ ...course, type: e.target.value })}
                placeholder="Tipo de curso"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Categoría *</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={course.category || ""}
                onChange={e => setCourse({ ...course, category: e.target.value })}
                placeholder="Categoría"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Descripción</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={course.description || ""}
                onChange={e => setCourse({ ...course, description: e.target.value })}
                placeholder="Descripción del curso"
                rows={3}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Fecha de inicio</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={formatDate(course.start_date)}
                onChange={e => setCourse({ ...course, start_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Idioma</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={course.language || ""}
                onChange={e => setCourse({ ...course, language: e.target.value })}
                placeholder="Idioma"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">¿Es popular?</label>
              <input
                type="checkbox"
                checked={course.is_popular}
                onChange={e => setCourse({ ...course, is_popular: e.target.checked })}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">¿Es nuevo?</label>
              <input
                type="checkbox"
                checked={course.is_new}
                onChange={e => setCourse({ ...course, is_new: e.target.checked })}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">¿Es tendencia?</label>
              <input
                type="checkbox"
                checked={course.is_trending}
                onChange={e => setCourse({ ...course, is_trending: e.target.checked })}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Cantidad de cursos (si aplica)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={course.course_count || ""}
                onChange={e => setCourse({ ...course, course_count: e.target.value })}
                placeholder="Cantidad de cursos"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Duración</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={course.duration || ""}
                onChange={e => setCourse({ ...course, duration: e.target.value })}
                placeholder="Duración"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Esfuerzo semanal (horas)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={course.effort_hours || ""}
                onChange={e => setCourse({ ...course, effort_hours: e.target.value })}
                placeholder="Horas por semana"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Nivel</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={course.level || ""}
                onChange={e => setCourse({ ...course, level: e.target.value })}
                placeholder="Nivel"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Prerrequisitos</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={course.prerequisites || ""}
                onChange={e => setCourse({ ...course, prerequisites: e.target.value })}
                placeholder="Prerrequisitos"
                rows={2}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Calificación (rating)</label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded px-3 py-2"
                value={course.rating || ""}
                onChange={e => setCourse({ ...course, rating: e.target.value })}
                placeholder="Calificación"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">¿Incluye certificado?</label>
              <input
                type="checkbox"
                checked={course.has_certificate}
                onChange={e => setCourse({ ...course, has_certificate: e.target.checked })}
              />
            </div>
            {/* Agrega aquí los demás campos opcionales si lo deseas */}
          </div>
          <div className="flex justify-end mt-6">
            <button
              className={`px-6 py-2 bg-[#8B0D37] text-white rounded font-semibold ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={handleSaveCourse}
              disabled={saving}
            >
              {saving ? (isEdit ? 'Guardando cambios...' : 'Guardando...') : (isEdit ? 'Guardar cambios' : 'Guardar curso completo')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseBuilder;