import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus,
  Trash2,
  Play,
  FileText,
  Link,
  HelpCircle,
  Download,
  Save,
  Edit3,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Award,
  Globe,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createCourse, fetchCourseById, fetchSlidesByCourseId, updateCourse } from "../../../services/api";
import { cn } from "@/lib/utils";

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

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const getYoutubeEmbedUrl = (url) => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const validateSlide = (slide) => {
  const errs = {};
  if (!slide.title.trim()) errs.title = "El título es obligatorio.";
  if (slide.embedUrl && !validateEmbedUrl(slide.embedUrl)) {
    errs.embedUrl = "El enlace de inserción no es válido. Usa el enlace de 'insertar' de Google Slides, Canva o PowerPoint Online.";
  }
  if (slide.videoUrl && !isValidUrl(slide.videoUrl)) {
    errs.videoUrl = "El enlace de video no es una URL válida.";
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

const validateCourse = (course) => {
  const errs = {};
  if (!isValidUrl(course.image_url)) errs.image_url = "La URL de la imagen no es válida.";
  if (!isValidUrl(course.logo_url)) errs.logo_url = "La URL del logo no es válida.";
  if (course.rating && (Number(course.rating) < 0 || Number(course.rating) > 5)) errs.rating = "El rating debe estar entre 0 y 5.";
  if (course.start_date) {
    const startDate = new Date(course.start_date);
    const today = new Date();
    // Comparar solo la fecha, ignorando la hora
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      errs.start_date = "La fecha de inicio no puede ser en el pasado.";
    }
  }
  return errs;
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
    const courseErrs = validateCourse(course);
    if (Object.keys(courseErrs).length > 0) {
      setErrors(courseErrs);
      alert("Corrige los errores en los datos del curso antes de guardar.");
      return;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex h-screen">
        {/* Sidebar de slides */}
        <aside className="w-80 bg-white border-r border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#F8E6ED] rounded-lg">
                <BookOpen className="h-5 w-5 text-[#8B0D37]" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Lecciones</h2>
                <p className="text-sm text-slate-500">
                  {slides.length} lección{slides.length !== 1 ? "es" : ""}
                </p>
              </div>
            </div>
            <Button onClick={addSlide} className="w-full bg-[#8B0D37] hover:bg-[#6E0B2A]" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar lección
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="p-4 space-y-2">
              {slides.map((slide, idx) => (
                <Card
                  key={idx}
                  className={`cursor-pointer transition-all duration-200 ${
                    idx === selectedSlide
                      ? "ring-2 ring-[#8B0D37] bg-[#F8E6ED] border-[#E2B6C6]"
                      : "hover:bg-slate-50 border-slate-200"
                  }`}
                  onClick={() => setSelectedSlide(idx)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            idx === selectedSlide ? "bg-[#8B0D37] text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 truncate">
                            {slide.title || `Lección ${idx + 1}`}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {slide.videoUrl && <Play className="h-3 w-3 text-slate-400" />}
                            {slide.embedUrl && <FileText className="h-3 w-3 text-slate-400" />}
                            {slide.quiz.length > 0 && <HelpCircle className="h-3 w-3 text-slate-400" />}
                            {slide.resources.length > 0 && <Download className="h-3 w-3 text-slate-400" />}
                          </div>
                        </div>
                      </div>
                      {slides.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSlide(idx);
                          }}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Panel principal */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {isEdit ? "Editar Curso" : "Crear Nuevo Curso"}
                  </h1>
                  <p className="text-slate-600">
                    {isEdit
                      ? "Modifica los detalles de tu curso existente"
                      : "Crea un curso completo con lecciones interactivas"}
                  </p>
                </div>
                <Button
                  onClick={handleSaveCourse}
                  disabled={saving}
                  size="lg"
                  className="bg-[#8B0D37] hover:bg-[#6E0B2A]"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEdit ? "Guardar cambios" : "Crear curso"}
                    </>
                  )}
                </Button>
              </div>

              {isEdit && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-800">Modo edición</p>
                    <p className="text-sm text-amber-700">Estás editando un curso existente</p>
                  </div>
                </div>
              )}
            </div>

            <Tabs defaultValue="lesson" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lesson" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Editar Lección
                </TabsTrigger>
                <TabsTrigger value="course" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Datos del Curso
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lesson" className="space-y-6">
                {/* Editor de slide */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#8B0D37] text-white flex items-center justify-center text-sm font-medium">
                        {selectedSlide + 1}
                      </div>
                      Lección {selectedSlide + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Título y contenido */}
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label htmlFor="title" className="text-base font-medium">
                          Título de la lección
                        </Label>
                        <Input
                          id="title"
                          value={slides[selectedSlide].title || ""}
                          onChange={(e) => updateSlide("title", e.target.value)}
                          placeholder="Ingresa el título de la lección"
                          className={`mt-2 ${errors.title ? "border-red-500" : ""}`}
                        />
                        {errors.title && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.title}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="content" className="text-base font-medium">
                          Contenido
                        </Label>
                        <Textarea
                          id="content"
                          value={slides[selectedSlide].content || ""}
                          onChange={(e) => updateSlide("content", e.target.value)}
                          placeholder="Describe el contenido de esta lección..."
                          rows={4}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Video y presentación */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="video" className="text-base font-medium flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          Video de YouTube
                        </Label>
                        <Input
                          id="video"
                          value={slides[selectedSlide].videoUrl || ""}
                          onChange={(e) => updateSlide("videoUrl", e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="mt-2"
                        />
                        {errors.videoUrl && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.videoUrl}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="embed" className="text-base font-medium flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          Presentación embebida
                        </Label>
                        <Input
                          id="embed"
                          value={slides[selectedSlide].embedUrl || ""}
                          onChange={(e) => updateSlide("embedUrl", e.target.value)}
                          placeholder="https://docs.google.com/presentation/..."
                          className={`mt-2 ${errors.embedUrl ? "border-red-500" : ""}`}
                        />
                        {errors.embedUrl && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.embedUrl}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Preview de presentación */}
                    {slides[selectedSlide].embedUrl && (
                      <Card className="bg-slate-50">
                        <CardHeader>
                          <CardTitle className="text-lg">Vista previa de la presentación</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-video rounded-lg overflow-hidden bg-white shadow-sm">
                            <iframe
                              src={getYoutubeEmbedUrl(slides[selectedSlide].videoUrl)}
                              title="Presentación embebida"
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              allowFullScreen
                              className="rounded-lg"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>

                {/* Quiz */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Quiz de la lección
                      <Badge variant="secondary">
                        {slides[selectedSlide].quiz.length} pregunta{slides[selectedSlide].quiz.length !== 1 ? "s" : ""}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {slides[selectedSlide].quiz.map((q, qIdx) => (
                      <Card key={qIdx} className="bg-slate-50">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-medium">Pregunta {qIdx + 1}</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const quiz = slides[selectedSlide].quiz.filter((_, idx) => idx !== qIdx);
                                updateSlide("quiz", quiz);
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <Input
                            value={q.question || ""}
                            onChange={(e) => {
                              const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                                idx === qIdx ? { ...item, question: e.target.value } : item,
                              );
                              updateSlide("quiz", quiz);
                            }}
                            placeholder="Escribe tu pregunta aquí..."
                            className={errors[`quiz-q${qIdx}`] ? "border-red-500" : ""}
                          />
                          {errors[`quiz-q${qIdx}`] && (
                            <p className="text-red-600 text-sm flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {errors[`quiz-q${qIdx}`]}
                            </p>
                          )}

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Opciones de respuesta</Label>
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct-${qIdx}`}
                                    checked={q.answer === oIdx}
                                    onChange={() => {
                                      const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                                        idx === qIdx ? { ...item, answer: oIdx } : item,
                                      );
                                      updateSlide("quiz", quiz);
                                    }}
                                    className="text-[#8B0D37]"
                                  />
                                  <CheckCircle2
                                    className={`h-4 w-4 ${q.answer === oIdx ? "text-[#8B0D37]" : "text-slate-300"}`}
                                  />
                                </div>
                                <Input
                                  value={opt || ""}
                                  onChange={(e) => {
                                    const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                                      idx === qIdx
                                        ? {
                                            ...item,
                                            options: item.options.map((o, oi) => (oi === oIdx ? e.target.value : o)),
                                          }
                                        : item,
                                    );
                                    updateSlide("quiz", quiz);
                                  }}
                                  placeholder={`Opción ${oIdx + 1}`}
                                  className="flex-1"
                                />
                                {q.options.length > 2 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
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
                                          : item,
                                      );
                                      updateSlide("quiz", quiz);
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            {errors[`quiz-opt${qIdx}`] && (
                              <p className="text-red-600 text-sm flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors[`quiz-opt${qIdx}`]}
                              </p>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                                  idx === qIdx ? { ...item, options: [...item.options, ""] } : item,
                                );
                                updateSlide("quiz", quiz);
                              }}
                              className="mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar opción
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => {
                        const quiz = [...slides[selectedSlide].quiz, { question: "", options: ["", ""], answer: 0 }];
                        updateSlide("quiz", quiz);
                      }}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar pregunta
                    </Button>
                  </CardContent>
                </Card>

                {/* Recursos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Recursos descargables
                      <Badge variant="secondary">
                        {slides[selectedSlide].resources.length} recurso{slides[selectedSlide].resources.length !== 1 ? "s" : ""}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {slides[selectedSlide].resources.map((res, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Input
                          value={res.name || ""}
                          onChange={(e) => {
                            const resources = slides[selectedSlide].resources.map((item, idx) =>
                              idx === rIdx ? { ...item, name: e.target.value } : item,
                            );
                            updateSlide("resources", resources);
                          }}
                          placeholder="Nombre del recurso"
                          className="flex-1"
                        />
                        <Input
                          value={res.url || ""}
                          onChange={(e) => {
                            const resources = slides[selectedSlide].resources.map((item, idx) =>
                              idx === rIdx ? { ...item, url: e.target.value } : item,
                            );
                            updateSlide("resources", resources);
                          }}
                          placeholder="URL de descarga"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const resources = slides[selectedSlide].resources.filter((_, idx) => idx !== rIdx);
                            updateSlide("resources", resources);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => {
                        const resources = [...slides[selectedSlide].resources, { name: "", url: "" }];
                        updateSlide("resources", resources);
                      }}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar recurso
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="course" className="space-y-6">
                {/* Datos generales del curso */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Información básica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="course-title" className="text-base font-medium">
                          Título del curso *
                        </Label>
                        <Input
                          id="course-title"
                          value={course.title || ""}
                          onChange={(e) => setCourse({ ...course, title: e.target.value })}
                          placeholder="Título del curso"
                          className="mt-2"
                          required
                        />
                        {errors.title && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.title}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="provider" className="text-base font-medium">
                          Proveedor *
                        </Label>
                        <Input
                          id="provider"
                          value={course.provider || ""}
                          onChange={(e) => setCourse({ ...course, provider: e.target.value })}
                          placeholder="Nombre del proveedor"
                          className="mt-2"
                          required
                        />
                        {errors.provider && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.provider}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="category" className="text-base font-medium">
                          Categoría *
                        </Label>
                        <Input
                          id="category"
                          value={course.category || ""}
                          onChange={(e) => setCourse({ ...course, category: e.target.value })}
                          placeholder="Categoría del curso"
                          className="mt-2"
                          required
                        />
                        {errors.category && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.category}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="type" className="text-base font-medium">
                          Tipo *
                        </Label>
                        <Input
                          id="type"
                          value={course.type || ""}
                          onChange={(e) => setCourse({ ...course, type: e.target.value })}
                          placeholder="Tipo de curso"
                          className="mt-2"
                          required
                        />
                        {errors.type && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.type}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-base font-medium">
                        Descripción
                      </Label>
                      <Textarea
                        id="description"
                        value={course.description || ""}
                        onChange={(e) => setCourse({ ...course, description: e.target.value })}
                        placeholder="Describe de qué trata el curso..."
                        rows={4}
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="image-url" className="text-base font-medium">
                          Imagen del curso (URL) *
                        </Label>
                        <Input
                          id="image-url"
                          value={course.image_url || ""}
                          onChange={(e) => setCourse({ ...course, image_url: e.target.value })}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          className="mt-2"
                          required
                        />
                        {errors.image_url && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.image_url}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="logo-url" className="text-base font-medium">
                          Logo del proveedor (URL) *
                        </Label>
                        <Input
                          id="logo-url"
                          value={course.logo_url || ""}
                          onChange={(e) => setCourse({ ...course, logo_url: e.target.value })}
                          placeholder="https://ejemplo.com/logo.jpg"
                          className="mt-2"
                          required
                        />
                        {errors.logo_url && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.logo_url}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Detalles del curso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="start-date" className="text-base font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Fecha de inicio
                        </Label>
                        <Input
                          id="start-date"
                          type="date"
                          value={formatDate(course.start_date)}
                          onChange={(e) => setCourse({ ...course, start_date: e.target.value })}
                          className={`mt-2 ${errors.start_date ? "border-red-500" : ""}`}
                        />
                        {errors.start_date && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.start_date}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="duration" className="text-base font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Duración
                        </Label>
                        <Input
                          id="duration"
                          value={course.duration || ""}
                          onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                          placeholder="8 semanas"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="effort" className="text-base font-medium flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Esfuerzo semanal (horas)
                        </Label>
                        <Input
                          id="effort"
                          type="number"
                          value={course.effort_hours || ""}
                          onChange={(e) => setCourse({ ...course, effort_hours: e.target.value })}
                          placeholder="5"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="language" className="text-base font-medium flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Idioma
                        </Label>
                        <Input
                          id="language"
                          value={course.language || ""}
                          onChange={(e) => setCourse({ ...course, language: e.target.value })}
                          placeholder="Español"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="level" className="text-base font-medium">
                          Nivel
                        </Label>
                        <Input
                          id="level"
                          value={course.level || ""}
                          onChange={(e) => setCourse({ ...course, level: e.target.value })}
                          placeholder="Principiante"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating" className="text-base font-medium flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Calificación
                        </Label>
                        <Input
                          id="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={course.rating || ""}
                          onChange={(e) => setCourse({ ...course, rating: e.target.value })}
                          placeholder="4.5"
                          className="mt-2"
                        />
                        {errors.rating && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.rating}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="prerequisites" className="text-base font-medium">
                        Prerrequisitos
                      </Label>
                      <Textarea
                        id="prerequisites"
                        value={course.prerequisites || ""}
                        onChange={(e) => setCourse({ ...course, prerequisites: e.target.value })}
                        placeholder="Conocimientos básicos requeridos..."
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Configuración adicional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="popular" className="text-base font-medium">
                            Curso popular
                          </Label>
                          <p className="text-sm text-slate-600">Marcar como curso destacado</p>
                        </div>
                        <Switch
                          id="popular"
                          checked={course.is_popular}
                          onCheckedChange={(checked) => setCourse({ ...course, is_popular: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="new" className="text-base font-medium">
                            Curso nuevo
                          </Label>
                          <p className="text-sm text-slate-600">Marcar como recién lanzado</p>
                        </div>
                        <Switch
                          id="new"
                          checked={course.is_new}
                          onCheckedChange={(checked) => setCourse({ ...course, is_new: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="trending" className="text-base font-medium">
                            En tendencia
                          </Label>
                          <p className="text-sm text-slate-600">Marcar como tendencia</p>
                        </div>
                        <Switch
                          id="trending"
                          checked={course.is_trending}
                          onCheckedChange={(checked) => setCourse({ ...course, is_trending: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="certificate" className="text-base font-medium">
                            Incluye certificado
                          </Label>
                          <p className="text-sm text-slate-600">Otorga certificado al completar</p>
                        </div>
                        <Switch
                          id="certificate"
                          checked={course.has_certificate}
                          onCheckedChange={(checked) => setCourse({ ...course, has_certificate: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseBuilder;