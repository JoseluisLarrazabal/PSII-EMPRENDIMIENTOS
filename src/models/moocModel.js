const pool = require("../config/database");

// Crear tablas necesarias si no existen
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
        curso_id INT,
        FOREIGN KEY (curso_id) REFERENCES curso(id) ON DELETE SET NULL
      )
    `);

    // 2. Tabla para temas/materias
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mooc_subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon_url VARCHAR(500) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    // 3. Relación muchos a muchos entre cursos y temas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mooc_course_subjects (
        catalog_id INT NOT NULL,
        subject_id INT NOT NULL,
        PRIMARY KEY (catalog_id, subject_id),
        FOREIGN KEY (catalog_id) REFERENCES mooc_catalog(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES mooc_subjects(id) ON DELETE CASCADE
      )
    `);

    // 4. Tabla para escuelas/instituciones
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mooc_schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `);

    // 5. Tabla para materias por escuela
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

// Obtener cursos por categoría con subject_ids
const getCoursesByCategory = async (category) => {
  // Primero obtenemos los cursos
  const [rows] = await pool.query(
    `
    SELECT * 
    FROM mooc_catalog 
    WHERE category = ?
    ORDER BY id
  `,
    [category]
  );
  
  // Para cada curso, obtenemos sus subject_ids
  const result = [];
  for (const course of rows) {
    const [subjects] = await pool.query(
      `
      SELECT subject_id
      FROM mooc_course_subjects
      WHERE catalog_id = ?
    `,
      [course.id]
    );
    
    // Crear un nuevo objeto que incluya todos los campos del curso original
    // más el array de subject_ids
    const courseWithSubjects = {
      ...course, // Spread operator para incluir todas las propiedades originales
      subject_ids: subjects.map(s => s.subject_id)
    };
    
    result.push(courseWithSubjects);
  }
  
  return result;
};

// Obtener cursos populares con subject_ids
const getPopularCourses = async () => {
  // Primero obtenemos los cursos populares
  const [rows] = await pool.query(`
    SELECT * 
    FROM mooc_catalog 
    WHERE is_popular = TRUE
    ORDER BY id
  `);
  
  // Para cada curso, obtenemos sus subject_ids
  const result = [];
  for (const course of rows) {
    const [subjects] = await pool.query(
      `
      SELECT subject_id
      FROM mooc_course_subjects
      WHERE catalog_id = ?
    `,
      [course.id]
    );
    
    // Crear un nuevo objeto que incluya todos los campos del curso original
    // más el array de subject_ids
    const courseWithSubjects = {
      ...course, // Spread operator para incluir todas las propiedades originales
      subject_ids: subjects.map(s => s.subject_id)
    };
    
    result.push(courseWithSubjects);
  }
  
  return result;
};

// Obtener cursos nuevos con subject_ids
const getNewCourses = async () => {
  // Primero obtenemos los cursos nuevos
  const [rows] = await pool.query(`
    SELECT * 
    FROM mooc_catalog 
    WHERE is_new = TRUE
    ORDER BY id
  `);
  
  // Para cada curso, obtenemos sus subject_ids
  const result = [];
  for (const course of rows) {
    const [subjects] = await pool.query(
      `
      SELECT subject_id
      FROM mooc_course_subjects
      WHERE catalog_id = ?
    `,
      [course.id]
    );
    
    // Crear un nuevo objeto que incluya todos los campos del curso original
    // más el array de subject_ids
    const courseWithSubjects = {
      ...course, // Spread operator para incluir todas las propiedades originales
      subject_ids: subjects.map(s => s.subject_id)
    };
    
    result.push(courseWithSubjects);
  }
  
  return result;
};

// Obtener cursos tendencia con subject_ids
const getTrendingCourses = async () => {
  // Primero obtenemos los cursos tendencia
  const [rows] = await pool.query(`
    SELECT * 
    FROM mooc_catalog 
    WHERE is_trending = TRUE
    ORDER BY id
  `);
  
  // Para cada curso, obtenemos sus subject_ids
  const result = [];
  for (const course of rows) {
    const [subjects] = await pool.query(
      `
      SELECT subject_id
      FROM mooc_course_subjects
      WHERE catalog_id = ?
    `,
      [course.id]
    );
    
    // Crear un nuevo objeto que incluya todos los campos del curso original
    // más el array de subject_ids
    const courseWithSubjects = {
      ...course, // Spread operator para incluir todas las propiedades originales
      subject_ids: subjects.map(s => s.subject_id)
    };
    
    result.push(courseWithSubjects);
  }
  
  return result;
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
const createCourse = async (courseData) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `
        INSERT INTO mooc_catalog (
          title, provider, image_url, logo_url, type, 
          course_count, category, is_popular, is_new, is_trending,
          school_id, administrador_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      ]
    );

    const courseId = result.insertId;

    // Si hay temas asociados, los insertamos
    if (courseData.subjects && courseData.subjects.length > 0) {
      for (const subjectId of courseData.subjects) {
        await connection.query(
          `
          INSERT INTO mooc_course_subjects (catalog_id, subject_id)
          VALUES (?, ?)
        `,
          [courseId, subjectId]
        );
      }
    }

    await connection.commit();
    return courseId;
  } catch (error) {
    await connection.rollback();
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
        is_trending = ?
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
};