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
  Check,
  ExternalLink,
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

// 🔥 VALIDACIONES MEJORADAS
const validationRules = {
  // Validar URLs
  isValidUrl: (url) => {
    const stringUrl = String(url || '');
    if (!stringUrl.trim()) return true; // URLs opcionales
    try {
      new URL(stringUrl);
      return true;
    } catch {
      return false;
    }
  },

  // Validar URL de YouTube
  isValidYouTubeUrl: (url) => {
    const stringUrl = String(url || '');
    if (!stringUrl.trim()) return true;
    const patterns = [/^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/];
    return patterns.some((pattern) => pattern.test(stringUrl));
  },

  // Validar URL de presentación embebida
  isValidEmbedUrl: (url) => {
    const stringUrl = String(url || '');
    if (!stringUrl.trim()) return true;
    const patterns = [
      /^https:\/\/docs\.google\.com\/presentation\/d\/e\/.+\/embed/,
      /^https:\/\/www\.canva\.com\/design\/.+\/view\?embed/,
      /^https:\/\/onedrive\.live\.com\/embed\?resid=.+/,
      /^https:\/\/view\.genial\.ly\/.+/,
      /^https:\/\/prezi\.com\/embed\/.+/,
    ];
    return patterns.some((pattern) => pattern.test(stringUrl));
  },

  // Validar fecha
  isValidDate: (dateString) => {
    const stringDate = String(dateString || '');
    if (!stringDate.trim()) return true;
    const date = new Date(stringDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && !isNaN(date.getTime());
  },

  // Validar rating
  isValidRating: (rating) => {
    const stringRating = String(rating || '');
    if (!stringRating.trim()) return true;
    const num = Number.parseFloat(stringRating);
    return !isNaN(num) && num >= 0 && num <= 5;
  },

  // Validar número positivo
  isValidPositiveNumber: (value) => {
    const stringValue = String(value || '');
    if (!stringValue.trim()) return true;
    const num = Number.parseFloat(stringValue);
    return !isNaN(num) && num > 0;
  },
}

// 🔥 FUNCIÓN DE VALIDACIÓN COMPLETA
const validateField = (field, value, context = {}) => {
  const errors = []

  // Convertir value a string para aplicar trim y otras validaciones de string
  const stringValue = String(value || '');

  switch (field) {
    case "title":
      if (!stringValue.trim()) {
        errors.push("El título es obligatorio")
      } else if (stringValue.trim().length < 3) {
        errors.push("El título debe tener al menos 3 caracteres")
      } else if (context.checkDuplicates && context.existingTitles?.includes(stringValue.trim())) {
        errors.push("Ya existe una lección con este título")
      }
      break

    case "videoUrl":
      if (stringValue.trim() && !validationRules.isValidYouTubeUrl(stringValue)) {
        errors.push("URL de YouTube no válida. Usa: https://youtube.com/watch?v=...")
      }
      break

    case "embedUrl":
      if (stringValue.trim() && !validationRules.isValidEmbedUrl(stringValue)) {
        errors.push("URL de presentación no válida. Usa enlaces de inserción de Google Slides, Canva, etc.")
      }
      break

    case "image_url":
    case "logo_url":
      if (!stringValue.trim()) {
        errors.push("Este campo es obligatorio")
      } else if (!validationRules.isValidUrl(stringValue)) {
        errors.push("URL no válida")
      }
      break

    case "start_date":
      if (stringValue.trim() && !validationRules.isValidDate(stringValue)) {
        errors.push("La fecha debe ser hoy o posterior")
      }
      break

    case "rating":
      if (stringValue.trim() && !validationRules.isValidRating(stringValue)) {
        errors.push("La calificación debe estar entre 0 y 5")
      }
      break

    case "effort_hours":
      if (stringValue.trim() && !validationRules.isValidPositiveNumber(stringValue)) {
        errors.push("Debe ser un número positivo")
      }
      break

    case "resourceUrl":
      if (stringValue.trim() && !validationRules.isValidUrl(stringValue)) {
        errors.push("URL de recurso no válida")
      }
      break

    default:
      if (context.required && !stringValue.trim()) {
        errors.push("Este campo es obligatorio")
      }
  }

  return errors
}

// 🔥 COMPONENTE DE FEEDBACK VISUAL
const FieldFeedback = ({ errors, success, className }) => {
  if (errors?.length > 0) {
    return (
      <div className={cn("space-y-1", className)}>
        {errors.map((error, idx) => (
          <p key={idx} className="text-red-600 text-sm flex items-center gap-1">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </p>
        ))}
      </div>
    )
  }

  if (success) {
    return (
      <p className={cn("text-green-600 text-sm flex items-center gap-1", className)}>
        <Check className="h-4 w-4" />
        {success}
      </p>
    )
  }

  return null
}

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldSuccess, setFieldSuccess] = useState({});
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get("id");

  // 🔥 VALIDACIÓN EN TIEMPO REAL
  const validateFieldRealTime = (field, value, slideIndex = null) => {
    const fieldKey = slideIndex !== null ? `${field}_${slideIndex}` : field;

    // Contexto para validaciones
    const context = {
      checkDuplicates: field === "title",
      existingTitles: slides.map((slide, idx) => (idx !== slideIndex ? String(slide.title || '').trim() : '')).filter(Boolean),
      required: ["title", "provider", "image_url", "logo_url", "type", "category"].includes(field),
    };

    const errors = validateField(field, value, context);

    setFieldErrors((prev) => ({
      ...prev,
      [fieldKey]: errors.length > 0 ? errors : undefined,
    }));

    // Mostrar éxito si no hay errores y el campo tiene contenido válido
    if (errors.length === 0 && String(value || '').trim()) {
      let successMessage = "";
      if (field === "videoUrl" && validationRules.isValidYouTubeUrl(value)) {
        successMessage = "URL de YouTube válida";
      } else if (field === "embedUrl" && validationRules.isValidEmbedUrl(value)) {
        successMessage = "URL de presentación válida";
      } else if (["image_url", "logo_url"].includes(field) && validationRules.isValidUrl(value)) {
        successMessage = "URL válida";
      } else if (field === "rating" && validationRules.isValidRating(value)) {
        successMessage = "Calificación válida";
      }

      setFieldSuccess((prev) => ({
        ...prev,
        [fieldKey]: successMessage || undefined,
      }));
    } else {
      setFieldSuccess((prev) => ({
        ...prev,
        [fieldKey]: undefined,
      }));
    }
  };

  // 🔥 VALIDACIÓN COMPLETA ANTES DE GUARDAR
  const validateAllFields = () => {
    const errors = {};
    let hasErrors = false;

    // Validar campos del curso
    const courseFields = [
      { field: "title", value: course.title, required: true },
      { field: "provider", value: course.provider, required: true },
      { field: "image_url", value: course.image_url, required: true },
      { field: "logo_url", value: course.logo_url, required: true },
      { field: "type", value: course.type, required: true },
      { field: "category", value: course.category, required: true },
      { field: "start_date", value: course.start_date },
      { field: "rating", value: course.rating },
      { field: "effort_hours", value: course.effort_hours },
    ];

    courseFields.forEach(({ field, value, required }) => {
      const fieldErrors = validateField(field, value, { required });
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        hasErrors = true;
      }
    });

    // Validar slides
    const existingTitles = [];
    slides.forEach((slide, slideIndex) => {
      // Verificar títulos duplicados, asegurando que el título es un string
      const slideTitle = String(slide.title || '');
      if (slideTitle.trim()) {
        if (existingTitles.includes(slideTitle.trim())) {
          errors[`title_${slideIndex}`] = ["Título duplicado"];
          hasErrors = true;
        } else {
          existingTitles.push(slideTitle.trim());
        }
      }

      // Validar campos de slide
      const slideFields = [
        { field: "title", value: slide.title },
        { field: "videoUrl", value: slide.videoUrl },
        { field: "embedUrl", value: slide.embedUrl },
      ];

      slideFields.forEach(({ field, value }) => {
        const fieldErrors = validateField(field, value, {
          required: field === "title",
          checkDuplicates: false,
        });
        if (fieldErrors.length > 0) {
          errors[`${field}_${slideIndex}`] = fieldErrors;
          hasErrors = true;
        }
      });

      // Validar quiz
      slide.quiz.forEach((q, qIdx) => {
        if (!String(q.question || '').trim()) {
          errors[`quiz-q${slideIndex}-${qIdx}`] = ["La pregunta es obligatoria"];
          hasErrors = true;
        }
        if (q.options.length < 2) {
          errors[`quiz-opt${slideIndex}-${qIdx}`] = ["Debe haber al menos 2 opciones"];
          hasErrors = true;
        }
        if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.options.length) {
          errors[`quiz-ans${slideIndex}-${qIdx}`] = ["Debe marcar una respuesta correcta"];
          hasErrors = true;
        }
      });

      // Validar recursos
      slide.resources.forEach((res, rIdx) => {
        const resName = String(res.name || '');
        const resUrl = String(res.url || '');

        if ((resName.trim() && !resUrl.trim()) || (!resName.trim() && resUrl.trim())) {
          errors[`res${slideIndex}-${rIdx}`] = ["Completa ambos campos del recurso"];
          hasErrors = true;
        }
        if (resUrl.trim() && !validationRules.isValidUrl(resUrl)) {
          errors[`resourceUrl_${slideIndex}-${rIdx}`] = ["URL de recurso no válida"];
          hasErrors = true;
        }
      });
    });

    setFieldErrors(errors);
    return !hasErrors;
  };

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

    // Limpiar errores del slide eliminado
    const newErrors = { ...fieldErrors };
    Object.keys(newErrors).forEach((key) => {
      if (key.includes(`_${idx}`)) {
        delete newErrors[key];
      }
    });
    setFieldErrors(newErrors);
  };

  const updateSlide = (field, value) => {
    const newSlides = slides.map((slide, idx) =>
      idx === selectedSlide ? { ...slide, [field]: value } : slide
    );
    setSlides(newSlides);

    // Validar en tiempo real
    validateFieldRealTime(field, value, selectedSlide);
  };

  // 🔥 RENOMBRADA PARA EVITAR CONFLICTO CON updateCourse DE LA API
  const updateCourseField = (field, value) => {
    setCourse((prev) => ({ ...prev, [field]: value }));
    validateFieldRealTime(field, value);
  };

  // Guardar todo el curso y sus slides
  const handleSaveCourse = async () => {
    if (!validateAllFields()) {
      alert("Por favor corrige todos los errores antes de guardar el curso.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
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
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`slide-title-${selectedSlide}`}>Título de la lección</Label>
                        <Input
                          id={`slide-title-${selectedSlide}`}
                          value={String(slides[selectedSlide].title || "")}
                          onChange={(e) => updateSlide("title", e.target.value)}
                          placeholder="Título de la lección"
                          className={`mt-2 ${fieldErrors[`title_${selectedSlide}`] ? "border-red-500" : fieldSuccess[`title_${selectedSlide}`] ? "border-green-500" : ""}`}
                        />
                        <FieldFeedback
                          errors={fieldErrors[`title_${selectedSlide}`]}
                          success={fieldSuccess[`title_${selectedSlide}`]}
                        />
                      </div>

                      {/* 🔥 CAMPO CONTENT QUE FALTABA */}
                      <div>
                        <Label htmlFor={`slide-content-${selectedSlide}`}>Contenido de la lección</Label>
                        <Textarea
                          id={`slide-content-${selectedSlide}`}
                          value={String(slides[selectedSlide].content || "")}
                          onChange={(e) => updateSlide("content", e.target.value)}
                          placeholder="Contenido textual o instrucciones"
                          rows={4}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`slide-video-${selectedSlide}`}>URL del video (YouTube)</Label>
                        <Input
                          id={`slide-video-${selectedSlide}`}
                          value={String(slides[selectedSlide].videoUrl || "")}
                          onChange={(e) => updateSlide("videoUrl", e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className={`mt-2 ${fieldErrors[`videoUrl_${selectedSlide}`] ? "border-red-500" : fieldSuccess[`videoUrl_${selectedSlide}`] ? "border-green-500" : ""}`}
                        />
                        <FieldFeedback
                          errors={fieldErrors[`videoUrl_${selectedSlide}`]}
                          success={fieldSuccess[`videoUrl_${selectedSlide}`]}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`slide-embed-${selectedSlide}`}>URL de presentación embebida</Label>
                        <Input
                          id={`slide-embed-${selectedSlide}`}
                          value={String(slides[selectedSlide].embedUrl || "")}
                          onChange={(e) => updateSlide("embedUrl", e.target.value)}
                          placeholder="https://docs.google.com/presentation/d/..."
                          className={`mt-2 ${fieldErrors[`embedUrl_${selectedSlide}`] ? "border-red-500" : fieldSuccess[`embedUrl_${selectedSlide}`] ? "border-green-500" : ""}`}
                        />
                        <FieldFeedback
                          errors={fieldErrors[`embedUrl_${selectedSlide}`]}
                          success={fieldSuccess[`embedUrl_${selectedSlide}`]}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Preview de presentación - CORREGIDO */}
                    {slides[selectedSlide].embedUrl && (
                      <Card className="bg-slate-50">
                        <CardHeader>
                          <CardTitle className="text-lg">Vista previa de la presentación</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-video rounded-lg overflow-hidden bg-white shadow-sm">
                            <iframe
                              src={String(slides[selectedSlide].embedUrl || "")}
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
                            value={String(q.question || "")}
                            onChange={(e) => {
                              const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                                idx === qIdx ? { ...item, question: e.target.value } : item
                              );
                              updateSlide("quiz", quiz);
                            }}
                            placeholder="Escribe tu pregunta aquí..."
                            className={fieldErrors[`quiz-q${selectedSlide}-${qIdx}`] ? "border-red-500" : ""}
                          />
                          {fieldErrors[`quiz-q${selectedSlide}-${qIdx}`] && (
                            <p className="text-red-600 text-sm flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {fieldErrors[`quiz-q${selectedSlide}-${qIdx}`]}
                            </p>
                          )}

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Opciones de respuesta</Label>
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct-${selectedSlide}-${qIdx}`}
                                    checked={q.answer === oIdx}
                                    onChange={() => {
                                      const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                                        idx === qIdx ? { ...item, answer: oIdx } : item
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
                                  value={String(opt || "")}
                                  onChange={(e) => {
                                    const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                                      idx === qIdx
                                        ? {
                                            ...item,
                                            options: item.options.map((o, oi) => (oi === oIdx ? e.target.value : o)),
                                          }
                                        : item
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
                                          : item
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
                            {fieldErrors[`quiz-opt${selectedSlide}-${qIdx}`] && (
                              <p className="text-red-600 text-sm flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {fieldErrors[`quiz-opt${selectedSlide}-${qIdx}`]}
                              </p>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const quiz = slides[selectedSlide].quiz.map((item, idx) =>
                                  idx === qIdx ? { ...item, options: [...item.options, ""] } : item
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
                          value={String(res.name || "")}
                          onChange={(e) => {
                            const resources = slides[selectedSlide].resources.map((item, idx) =>
                              idx === rIdx ? { ...item, name: e.target.value } : item
                            );
                            updateSlide("resources", resources);
                          }}
                          placeholder="Nombre del recurso"
                          className="flex-1"
                        />
                        <Input
                          value={String(res.url || "")}
                          onChange={(e) => {
                            const resources = slides[selectedSlide].resources.map((item, idx) =>
                              idx === rIdx ? { ...item, url: e.target.value } : item
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
                    {fieldErrors[`res${selectedSlide}-${slides[selectedSlide].resources.length - 1}`] && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {fieldErrors[`res${selectedSlide}-${slides[selectedSlide].resources.length - 1}`]}
                      </p>
                    )}

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
                          value={String(course.title || "")}
                          onChange={(e) => updateCourseField("title", e.target.value)}
                          placeholder="Título del curso"
                          className={`mt-2 ${fieldErrors.title ? "border-red-500" : fieldSuccess.title ? "border-green-500" : ""}`}
                          required
                        />
                        <FieldFeedback
                          errors={fieldErrors.title}
                          success={fieldSuccess.title}
                        />
                      </div>
                      <div>
                        <Label htmlFor="provider" className="text-base font-medium">
                          Proveedor *
                        </Label>
                        <Input
                          id="provider"
                          value={String(course.provider || "")}
                          onChange={(e) => updateCourseField("provider", e.target.value)}
                          placeholder="Nombre del proveedor"
                          className={`mt-2 ${fieldErrors.provider ? "border-red-500" : fieldSuccess.provider ? "border-green-500" : ""}`}
                          required
                        />
                        <FieldFeedback
                          errors={fieldErrors.provider}
                          success={fieldSuccess.provider}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category" className="text-base font-medium">
                          Categoría *
                        </Label>
                        <Input
                          id="category"
                          value={String(course.category || "")}
                          onChange={(e) => updateCourseField("category", e.target.value)}
                          placeholder="Categoría del curso"
                          className={`mt-2 ${fieldErrors.category ? "border-red-500" : fieldSuccess.category ? "border-green-500" : ""}`}
                          required
                        />
                        <FieldFeedback
                          errors={fieldErrors.category}
                          success={fieldSuccess.category}
                        />
                      </div>
                      <div>
                        <Label htmlFor="type" className="text-base font-medium">
                          Tipo *
                        </Label>
                        <Input
                          id="type"
                          value={String(course.type || "")}
                          onChange={(e) => updateCourseField("type", e.target.value)}
                          placeholder="Tipo de curso"
                          className={`mt-2 ${fieldErrors.type ? "border-red-500" : fieldSuccess.type ? "border-green-500" : ""}`}
                          required
                        />
                        <FieldFeedback
                          errors={fieldErrors.type}
                          success={fieldSuccess.type}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-base font-medium">
                        Descripción
                      </Label>
                      <Textarea
                        id="description"
                        value={String(course.description || "")}
                        onChange={(e) => updateCourseField("description", e.target.value)}
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
                          value={String(course.image_url || "")}
                          onChange={(e) => updateCourseField("image_url", e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          className={`mt-2 ${fieldErrors.image_url ? "border-red-500" : fieldSuccess.image_url ? "border-green-500" : ""}`}
                          required
                        />
                        <FieldFeedback
                          errors={fieldErrors.image_url}
                          success={fieldSuccess.image_url}
                        />
                      </div>
                      <div>
                        <Label htmlFor="logo-url" className="text-base font-medium">
                          Logo del proveedor (URL) *
                        </Label>
                        <Input
                          id="logo-url"
                          value={String(course.logo_url || "")}
                          onChange={(e) => updateCourseField("logo_url", e.target.value)}
                          placeholder="https://ejemplo.com/logo.jpg"
                          className={`mt-2 ${fieldErrors.logo_url ? "border-red-500" : fieldSuccess.logo_url ? "border-green-500" : ""}`}
                          required
                        />
                        <FieldFeedback
                          errors={fieldErrors.logo_url}
                          success={fieldSuccess.logo_url}
                        />
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
                          onChange={(e) => updateCourseField("start_date", e.target.value)}
                          className={`mt-2 ${fieldErrors.start_date ? "border-red-500" : ""}`}
                        />
                        <FieldFeedback
                          errors={fieldErrors.start_date}
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration" className="text-base font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Duración
                        </Label>
                        <Input
                          id="duration"
                          value={String(course.duration || "")}
                          onChange={(e) => updateCourseField("duration", e.target.value)}
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
                          value={String(course.effort_hours || "")}
                          onChange={(e) => updateCourseField("effort_hours", e.target.value)}
                          placeholder="5"
                          className={`mt-2 ${fieldErrors.effort_hours ? "border-red-500" : ""}`}
                        />
                        <FieldFeedback
                          errors={fieldErrors.effort_hours}
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
                          value={String(course.language || "")}
                          onChange={(e) => updateCourseField("language", e.target.value)}
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
                          value={String(course.level || "")}
                          onChange={(e) => updateCourseField("level", e.target.value)}
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
                          value={String(course.rating || "")}
                          onChange={(e) => updateCourseField("rating", e.target.value)}
                          placeholder="4.5"
                          className={`mt-2 ${fieldErrors.rating ? "border-red-500" : fieldSuccess.rating ? "border-green-500" : ""}`}
                        />
                        <FieldFeedback
                          errors={fieldErrors.rating}
                          success={fieldSuccess.rating}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="prerequisites" className="text-base font-medium">
                        Prerrequisitos
                      </Label>
                      <Textarea
                        id="prerequisites"
                        value={String(course.prerequisites || "")}
                        onChange={(e) => updateCourseField("prerequisites", e.target.value)}
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
                          onCheckedChange={(checked) => updateCourseField("is_popular", checked)}
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
                          onCheckedChange={(checked) => updateCourseField("is_new", checked)}
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
                          onCheckedChange={(checked) => updateCourseField("is_trending", checked)}
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
                          onCheckedChange={(checked) => updateCourseField("has_certificate", checked)}
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