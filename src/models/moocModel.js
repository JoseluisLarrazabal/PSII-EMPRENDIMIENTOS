const pool = require("../config/database");

// Crear tablas necesarias si no existen
// REEMPLAZA la función initializeTables en moocModel.js
const initializeTables = async () => {
  try {
    // 1. Tabla para el catálogo de cursos MOOC
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mooc_catalog (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        provider VARCHAR(100) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        logo_url VARCHAR(500) NOT NULL,
        type VARCHAR(100) NOT NULL,
        course_count INT DEFAULT NULL,
        category VARCHAR(100) NOT NULL,
        is_popular BOOLEAN DEFAULT FALSE,
        is_new BOOLEAN DEFAULT FALSE,
        is_trending BOOLEAN DEFAULT FALSE,
        has_certificate BOOLEAN DEFAULT FALSE,
        mentor_id INT DEFAULT NULL,
        school_id INT DEFAULT NULL,
        administrador_id INT DEFAULT NULL,
        description TEXT,
        start_date DATETIME DEFAULT NULL,
        duration VARCHAR(50) DEFAULT NULL,
        effort_hours INT DEFAULT NULL,
        language VARCHAR(50) DEFAULT NULL,
        level VARCHAR(50) DEFAULT NULL,
        prerequisites TEXT,
        enrollment_count INT DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0.00,
        video_preview_url VARCHAR(500) DEFAULT NULL,
        curso_id INT,
        FOREIGN KEY (curso_id) REFERENCES curso(id) ON DELETE SET NULL
      )
    `);

    // 🔥 2. TABLA QUE FALTABA - mooc_course_slides
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mooc_course_slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        video_url VARCHAR(500),
        embed_url VARCHAR(500),
        quiz JSON,
        resources JSON,
        slide_order INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES mooc_catalog(id) ON DELETE CASCADE,
        UNIQUE KEY uk_slide_order (course_id, slide_order)
      )
    `);

    // 3. Tabla para temas/materias
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mooc_subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon_url VARCHAR(500) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    // 4. Relación muchos a muchos entre cursos y temas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mooc_course_subjects (
        catalog_id INT NOT NULL,
        subject_id INT NOT NULL,
        PRIMARY KEY (catalog_id, subject_id),
        FOREIGN KEY (catalog_id) REFERENCES mooc_catalog(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES mooc_subjects(id) ON DELETE CASCADE
      )
    `);

    // 5. Tabla para escuelas/instituciones
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mooc_schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `);

    // 6. Tabla para materias por escuela
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mooc_school_subjects (
        school_id INT NOT NULL,
        subject_name VARCHAR(100) NOT NULL,
        PRIMARY KEY (school_id, subject_name),
        FOREIGN KEY (school_id) REFERENCES mooc_schools(id) ON DELETE CASCADE
      )
    `);

    console.log("Tablas MOOC inicializadas correctamente");
  } catch (error) {
    console.error("Error inicializando tablas MOOC:", error);
    throw error;
  }
};

// Obtener todas las categorías
const getCategories = async () => {
  const [rows] = await pool.query(`
    SELECT DISTINCT category 
    FROM mooc_catalog 
    ORDER BY category
  `);
  return rows;
};

const getCoursesWithSubjects = async (courseRows) => {
  if (!courseRows || courseRows.length === 0) return [];

  // Extract all course IDs
  const courseIds = courseRows.map((course) => course.id);

  // Get all subject relations in a single query
  const [subjectRelations] = await pool.query(
    `SELECT catalog_id, subject_id 
     FROM mooc_course_subjects 
     WHERE catalog_id IN (?)`,
    [courseIds]
  );

  // Group subject IDs by course ID
  const subjectsByCourseid = {};
  subjectRelations.forEach((relation) => {
    if (!subjectsByCourseid[relation.catalog_id]) {
      subjectsByCourseid[relation.catalog_id] = [];
    }
    subjectsByCourseid[relation.catalog_id].push(relation.subject_id);
  });

  // Add subject_ids to each course
  return courseRows.map((course) => ({
    ...course,
    subject_ids: subjectsByCourseid[course.id] || [],
  }));
};

// Obtener cursos por categoría con subject_ids
const getCoursesByCategory = async (category) => {
  const [rows] = await pool.query(
    `SELECT * 
     FROM mooc_catalog 
     WHERE category = ?
     ORDER BY id`,
    [category]
  );

  return await getCoursesWithSubjects(rows);
};

// Obtener cursos populares con subject_ids
const getPopularCourses = async () => {
  const [rows] = await pool.query(
    `SELECT * 
     FROM mooc_catalog 
     WHERE is_popular = TRUE
     ORDER BY id`
  );

  return await getCoursesWithSubjects(rows);
};
// Obtener cursos nuevos con subject_ids
const getNewCourses = async () => {
  const [rows] = await pool.query(
    `SELECT * 
     FROM mooc_catalog 
     WHERE is_new = TRUE
     ORDER BY id`
  );

  return await getCoursesWithSubjects(rows);
};

// Obtener cursos tendencia con subject_ids
const getTrendingCourses = async () => {
  const [rows] = await pool.query(
    `SELECT * 
     FROM mooc_catalog 
     WHERE is_trending = TRUE
     ORDER BY id`
  );

  return await getCoursesWithSubjects(rows);
};

// Nueva funcion para obtener todos los cursos de forma eficiente
const getAllCourses = async () => {
  try {
    // Get all categories
    const categories = await getCategories();

    // Object to store results
    const result = {
      categories: categories,
      coursesByCategory: {},
      specialCategories: {
        popular: await getPopularCourses(),
        new: await getNewCourses(),
        trending: await getTrendingCourses(),
      },
    };

    // Get courses for each category
    for (const cat of categories) {
      const categoryName = cat.category;
      result.coursesByCategory[categoryName] = await getCoursesByCategory(
        categoryName
      );
    }

    return result;
  } catch (error) {
    console.error("Error getting all courses:", error);
    throw error;
  }
};

// Obtener todos los temas/materias
const getSubjects = async () => {
  const [rows] = await pool.query(`
    SELECT * 
    FROM mooc_subjects 
    ORDER BY name
  `);
  return rows;
};

// Obtener todas las escuelas con sus materias
const getSchools = async () => {
  const [schools] = await pool.query(`
    SELECT * 
    FROM mooc_schools 
    ORDER BY name
  `);

  const result = [];

  for (const school of schools) {
    const [subjects] = await pool.query(
      `
      SELECT subject_name 
      FROM mooc_school_subjects 
      WHERE school_id = ?
    `,
      [school.id]
    );

    result.push({
      id: school.id,
      name: school.name,
      subjects: subjects.map((s) => s.subject_name),
    });
  }

  return result;
};

// Crear un nuevo curso
// REEMPLAZA la función createCourse en moocModel.js
const createCourse = async (courseData) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Insertar curso principal (solo campos necesarios)
    const [result] = await connection.query(
      `INSERT INTO mooc_catalog (
        title, provider, image_url, logo_url, type, 
        category, is_popular, is_new, is_trending,
        has_certificate, mentor_id, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        courseData.title,
        courseData.provider,
        courseData.image_url,
        courseData.logo_url,
        courseData.type,
        courseData.category,
        courseData.is_popular || false,
        courseData.is_new || false,
        courseData.is_trending || false,
        courseData.has_certificate || false,
        courseData.mentor_id || null,
        courseData.description || null,
      ]
    );

    const courseId = result.insertId;

    // 2. Insertar slides/lecciones
    if (courseData.slides && courseData.slides.length > 0) {
      for (let i = 0; i < courseData.slides.length; i++) {
        const slide = courseData.slides[i];
        await connection.query(
          `INSERT INTO mooc_course_slides 
            (course_id, title, content, video_url, embed_url, quiz, resources, slide_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            courseId,
            slide.title,
            slide.content || "",
            slide.videoUrl || null,
            slide.embedUrl || null,
            JSON.stringify(slide.quiz || []),
            JSON.stringify(slide.resources || []),
            i,
          ]
        );
      }
    }

    await connection.commit();
    return courseId;
  } catch (error) {
    await connection.rollback();
    console.error("Error en createCourse:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// Actualizar un curso existente
const updateCourse = async (id, courseData) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Actualizar todos los campos relevantes del curso
    await connection.query(
      `
      UPDATE mooc_catalog SET
        title = ?,
        provider = ?,
        image_url = ?,
        logo_url = ?,
        type = ?,
        course_count = ?,
        category = ?,
        is_popular = ?,
        is_new = ?,
        is_trending = ?,
        school_id = ?,
        administrador_id = ?,
        description = ?,
        start_date = ?,
        duration = ?,
        effort_hours = ?,
        language = ?,
        level = ?,
        prerequisites = ?,
        enrollment_count = ?,
        rating = ?,
        video_preview_url = ?,
        has_certificate = ?,
        mentor_id = ?
      WHERE id = ?
    `,
      [
        courseData.title,
        courseData.provider,
        courseData.image_url,
        courseData.logo_url,
        courseData.type,
        courseData.course_count || null,
        courseData.category,
        courseData.is_popular || false,
        courseData.is_new || false,
        courseData.is_trending || false,
        courseData.school_id || null,
        courseData.administrador_id || null,
        courseData.description || null,
        courseData.start_date || null,
        courseData.duration || null,
        courseData.effort_hours || null,
        courseData.language || null,
        courseData.level || null,
        courseData.prerequisites || null,
        courseData.enrollment_count || null,
        courseData.rating || null,
        courseData.video_preview_url || null,
        courseData.has_certificate || false,
        courseData.mentor_id || null,
        id,
      ]
    );

    // Si hay temas asociados, primero eliminamos los existentes
    if (courseData.subjects) {
      await connection.query(
        `
        DELETE FROM mooc_course_subjects WHERE catalog_id = ?
      `,
        [id]
      );

      // Luego insertamos los nuevos
      for (const subjectId of courseData.subjects) {
        await connection.query(
          `
          INSERT INTO mooc_course_subjects (catalog_id, subject_id)
          VALUES (?, ?)
        `,
          [id, subjectId]
        );
      }
    }

    // Actualizar slides: eliminar los existentes e insertar los nuevos
    if (courseData.slides) {
      await connection.query(
        `DELETE FROM mooc_course_slides WHERE course_id = ?`,
        [id]
      );
      for (let i = 0; i < courseData.slides.length; i++) {
        const slide = courseData.slides[i];
        await connection.query(
          `INSERT INTO mooc_course_slides 
            (course_id, title, content, video_url, embed_url, quiz, resources, slide_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            slide.title,
            slide.content,
            slide.videoUrl || null,
            slide.embedUrl || null,
            JSON.stringify(slide.quiz || []),
            JSON.stringify(slide.resources || []),
            i,
          ]
        );
      }
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Eliminar un curso
const deleteCourse = async (id) => {
  const [result] = await pool.query(
    `
    DELETE FROM mooc_catalog WHERE id = ?
  `,
    [id]
  );

  return result.affectedRows > 0;
};

// Obtener un curso por ID
// En moocModel.js, actualiza getCourseById:
const getCourseById = async (id) => {
  try {
    const [rows] = await pool.query(
      `SELECT mc.*, c.estado, c.fecha_inicio, c.duracion as duracion_curso, 
              c.horas_esfuerzo as horas_curso, c.idioma as idioma_curso, 
              c.nivel as nivel_curso, c.prerequisitos as prerequisitos_curso,
              c.certificado
       FROM mooc_catalog mc 
       LEFT JOIN curso c ON mc.curso_id = c.id 
       WHERE mc.id = ?`, 
      [Number(id)]
    );
    
    if (!rows[0]) return null;
    
    // Mapear campos correctamente
    const course = {
      ...rows[0],
      // Priorizar datos de la tabla curso si existen
      estado: rows[0].estado || 'borrador',
      start_date: rows[0].fecha_inicio || rows[0].start_date,
      duration: rows[0].duracion_curso || rows[0].duration,
      effort_hours: rows[0].horas_curso || rows[0].effort_hours,
      language: rows[0].idioma_curso || rows[0].language || 'Español',
      level: rows[0].nivel_curso || rows[0].level,
      prerequisites: rows[0].prerequisitos_curso || rows[0].prerequisites,
      has_certificate: rows[0].certificado === 1 || rows[0].has_certificate
    };
    
    return course;
  } catch (error) {
    console.error('Error en getCourseById:', error);
    throw error;
  }
};

// Obtener slides por ID de curso
// En moocModel.js, reemplaza getSlidesByCourseId:
const getSlidesByCourseId = async (catalogId) => {
  const connection = await pool.getConnection();
  try {
    console.log('🔍 Buscando slides para catalog ID:', catalogId);
    
    // Obtener curso_id
    const [catalogInfo] = await connection.query(
      'SELECT curso_id FROM mooc_catalog WHERE id = ?',
      [catalogId]
    );
    
    if (!catalogInfo[0] || !catalogInfo[0].curso_id) {
      // Si no hay curso_id, buscar en mooc_course_slides
      const [rows] = await connection.query(
        `SELECT id, title, content, video_url AS videoUrl, embed_url AS embedUrl, quiz, resources, slide_order
         FROM mooc_course_slides
         WHERE course_id = ?
         ORDER BY slide_order ASC`,
        [catalogId]
      );
      
      connection.release();
      return rows.map((slide) => ({
        ...slide,
        quiz: typeof slide.quiz === "string" ? JSON.parse(slide.quiz || "[]") : slide.quiz || [],
        resources: typeof slide.resources === "string" ? JSON.parse(slide.resources || "[]") : slide.resources || []
      }));
    }
    
    const cursoId = catalogInfo[0].curso_id;
    console.log('✅ Curso ID:', cursoId);
    
    // Obtener lecciones
    const [lecciones] = await connection.query(
      `SELECT 
        id,
        titulo as title,
        contenido_texto as content,
        video_url as videoUrl,
        embed_url as embedUrl,
        orden as slide_order
       FROM lecciones
       WHERE curso_id = ?
       ORDER BY orden ASC`,
      [cursoId]
    );
    
    console.log('📚 Lecciones encontradas:', lecciones.length);
    
    // Para cada lección obtener recursos y quiz
    for (let leccion of lecciones) {
      // Obtener recursos
      const [recursos] = await connection.query(
        `SELECT nombre as name, url_archivo as url, tipo as type
         FROM recursos 
         WHERE leccion_id = ?`,
        [leccion.id]
      );
      leccion.resources = recursos;
      
      // Inicializar quiz como array vacío
      leccion.quiz = [];
      
      // Obtener quiz
      const [quizData] = await connection.query(
        'SELECT id FROM quizzes WHERE leccion_id = ?',
        [leccion.id]
      );
      
      if (quizData.length > 0) {
        const quizId = quizData[0].id;
        
        // Obtener todas las preguntas y opciones
        const [questionData] = await connection.query(
          `SELECT 
            pq.id as pregunta_id,
            pq.texto_pregunta,
            pq.orden,
            opr.texto_opcion,
            opr.es_correcta
           FROM preguntas_quiz pq
           LEFT JOIN opciones_respuesta opr ON pq.id = opr.pregunta_id
           WHERE pq.quiz_id = ?
           ORDER BY pq.orden, opr.id`,
          [quizId]
        );
        
        // Agrupar por pregunta
        const preguntasMap = new Map();
        
        for (const row of questionData) {
          if (!preguntasMap.has(row.pregunta_id)) {
            preguntasMap.set(row.pregunta_id, {
              question: row.texto_pregunta,
              options: [],
              answer: 0
            });
          }
          
          const pregunta = preguntasMap.get(row.pregunta_id);
          if (row.texto_opcion) {
            pregunta.options.push(row.texto_opcion);
            if (row.es_correcta === 1) {
              pregunta.answer = pregunta.options.length - 1;
            }
          }
        }
        
        leccion.quiz = Array.from(preguntasMap.values());
      }
    }
    
    connection.release();
    return lecciones;
    
  } catch (error) {
    connection.release();
    console.error('❌ Error:', error);
    throw error;
  }
};

// Obtener cursos por mentor (administrador_id)
const getCoursesByMentorId = async (mentorId) => {
  console.log('🔍 Buscando cursos para mentor ID:', mentorId);
  
  try {
    // Buscar en mooc_catalog usando la relación con la tabla curso
    const [rows] = await pool.query(
      `SELECT mc.*, curso.estado, curso.fecha_inicio as fecha_creacion
       FROM mooc_catalog mc 
       INNER JOIN curso ON mc.curso_id = curso.id 
       WHERE curso.usuario_mentor_id = ? 
       ORDER BY mc.id DESC`,
      [mentorId]
    );
    
    console.log('✅ Cursos encontrados:', rows.length);
    return rows;
    
  } catch (error) {
    console.error('❌ Error en getCoursesByMentorId:', error);
    throw error;
  }
};

module.exports = {
  initializeTables,
  getCategories,
  getCoursesByCategory,
  getPopularCourses,
  getNewCourses,
  getTrendingCourses,
  getSubjects,
  getSchools,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  getSlidesByCourseId,
  getCoursesByMentorId,
};
