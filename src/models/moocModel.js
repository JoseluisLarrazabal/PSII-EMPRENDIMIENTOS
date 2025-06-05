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
const getCourseById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM mooc_catalog WHERE id = ?", [
    Number(id),
  ]);
  return rows[0] || null;
};

// Obtener slides por ID de curso
const getSlidesByCourseId = async (courseId) => {
  const [rows] = await pool.query(
    `SELECT id, title, content, video_url AS videoUrl, embed_url AS embedUrl, quiz, resources, slide_order
     FROM mooc_course_slides
     WHERE course_id = ?
     ORDER BY slide_order ASC`,
    [courseId]
  );
  // Parsear quiz y resources de JSON SOLO si son string
  return rows.map((slide) => ({
    ...slide,
    quiz:
      typeof slide.quiz === "string"
        ? slide.quiz.trim() === ""
          ? []
          : JSON.parse(slide.quiz)
        : Array.isArray(slide.quiz)
        ? slide.quiz
        : [],
    resources:
      typeof slide.resources === "string"
        ? slide.resources.trim() === ""
          ? []
          : JSON.parse(slide.resources)
        : Array.isArray(slide.resources)
        ? slide.resources
        : [],
  }));
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
