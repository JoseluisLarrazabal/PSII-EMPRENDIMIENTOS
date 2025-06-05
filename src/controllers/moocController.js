const moocModel = require('../models/moocModel');
const { createCourseWithContent, getCourseWithContent } = require('../models/contentModel');

// Inicializar tablas
const initializeTables = async (req, res, next) => {
  try {
    await moocModel.initializeTables();
    res.status(200).json({
      success: true,
      message: 'Tablas MOOC inicializadas correctamente'
    });
  } catch (error) {
    next(error);
  }
};

// Obtener categorías
const getCategories = async (req, res, next) => {
  try {
    const categories = await moocModel.getCategories();
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Obtener cursos por categoría
const getCoursesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    
    let courses;
    
    // Categorías especiales
    if (category === 'popular') {
      courses = await moocModel.getPopularCourses();
    } else if (category === 'new') {
      courses = await moocModel.getNewCourses();
    } else if (category === 'trending') {
      courses = await moocModel.getTrendingCourses();
    } else {
      courses = await moocModel.getCoursesByCategory(category);
    }
    
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// Obtener temas/materias
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await moocModel.getSubjects();
    res.status(200).json({
      success: true,
      data: subjects
    });
  } catch (error) {
    next(error);
  }
};

// Obtener escuelas con sus materias
const getSchools = async (req, res, next) => {
  try {
    const schools = await moocModel.getSchools();
    res.status(200).json({
      success: true,
      data: schools
    });
  } catch (error) {
    next(error);
  }
};

// 🔥 CREAR CURSO - SOLO USANDO CONTENTMODEL
const createCourse = async (req, res) => {
  try {
    console.log('Datos recibidos en createCourse:', req.body);
    
    const { 
      title, description, provider, image_url, logo_url, type, category, 
      slides, is_popular, is_new, is_trending, has_certificate, estado
    } = req.body;

    // Validar campos requeridos
    if (!title || !provider || !image_url || !logo_url || !type || !category) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: título, proveedor, imagen, logo, tipo o categoría"
      });
    }

    // Validar que haya al menos un slide
    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El curso debe tener al menos una lección"
      });
    }

    // 🔥 USAR SOLO CONTENTMODEL
    const result = await createCourseWithContent({
      title,
      description: description || '',
      provider,
      image_url,
      logo_url,
      type,
      category,
      estado: estado || 'borrador',
      is_popular: is_popular || false,
      is_new: is_new || false,
      is_trending: is_trending || false,
      has_certificate: has_certificate || false,
      mentor_id: req.user?.id || null,
      slides
    });

    res.status(201).json({
      success: true,
      message: "Curso creado exitosamente",
      data: result
    });
  } catch (error) {
    console.error("Error completo al crear curso:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear el curso",
      error: error.message
    });
  }
};

// Obtener un curso con su contenido
const getCourse = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const course = await getCourseWithContent(cursoId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrado"
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error("Error al obtener curso:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el curso",
      error: error.message
    });
  }
};

// 🔥 ACTUALIZAR - TAMBIÉN USAR CONTENTMODEL (pendiente implementar)
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const courseData = req.body;
    
    // Por ahora usar moocModel hasta implementar updateCourseWithContent
    const success = await moocModel.updateCourse(id, courseData);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Curso actualizado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// 🔥 ELIMINAR - TAMBIÉN USAR CONTENTMODEL (pendiente implementar)
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Por ahora usar moocModel hasta implementar deleteCourseWithContent
    const success = await moocModel.deleteCourse(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Curso eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los cursos agrupados por categoría
const getAllCourses = async (req, res, next) => {
  try {
    const categories = await moocModel.getCategories();
    
    const result = {
      categories: categories,
      coursesByCategory: {},
      specialCategories: {
        popular: [],
        new: [],
        trending: []
      }
    };
    
    for (const cat of categories) {
      const categoryName = cat.category;
      const courses = await moocModel.getCoursesByCategory(categoryName);
      result.coursesByCategory[categoryName] = courses;
    }
    
    result.specialCategories.popular = await moocModel.getPopularCourses();
    result.specialCategories.new = await moocModel.getNewCourses();
    result.specialCategories.trending = await moocModel.getTrendingCourses();
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un curso por ID
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await moocModel.getCourseById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Curso no encontrado" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// Obtener slides por ID de curso
const getSlidesByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const slides = await moocModel.getSlidesByCourseId(id);
    res.status(200).json({ success: true, data: slides });
  } catch (error) {
    console.error("Error en getSlidesByCourseId:", error);
    next(error);
  }
};

// 🔥 MIS CURSOS - ARREGLADO
const getMyCourses = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    if (!mentorId) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }
    
    console.log('🔍 Buscando cursos para mentor:', mentorId);
    const myCourses = await moocModel.getCoursesByMentorId(mentorId);
    
    res.status(200).json({ success: true, data: myCourses });
  } catch (error) {
    console.error('❌ Error en getMyCourses:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener cursos del mentor',
      error: error.message 
    });
  }
};

module.exports = {
  initializeTables,
  getCategories,
  getCoursesByCategory,
  getSubjects,
  getSchools,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getSlidesByCourseId,
  getMyCourses,
  getCourse
};