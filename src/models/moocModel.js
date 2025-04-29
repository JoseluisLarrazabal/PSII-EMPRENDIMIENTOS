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

const getCoursesWithSubjects = async (courseRows) => {
  if (!courseRows || courseRows.length === 0) return [];
  
  // Extract all course IDs
  const courseIds = courseRows.map(course => course.id);
  
  // Get all subject relations in a single query
  const [subjectRelations] = await pool.query(
    `SELECT catalog_id, subject_id 
     FROM mooc_course_subjects 
     WHERE catalog_id IN (?)`,
    [courseIds]
  );
  
  // Group subject IDs by course ID
  const subjectsByCourseid = {};
  subjectRelations.forEach(relation => {
    if (!subjectsByCourseid[relation.catalog_id]) {
      subjectsByCourseid[relation.catalog_id] = [];
    }
    subjectsByCourseid[relation.catalog_id].push(relation.subject_id);
  });
  
  // Add subject_ids to each course
  return courseRows.map(course => ({
    ...course,
    subject_ids: subjectsByCourseid[course.id] || []
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
        trending: await getTrendingCourses()
      }
    };
    
    // Get courses for each category
    for (const cat of categories) {
      const categoryName = cat.category;
      result.coursesByCategory[categoryName] = await getCoursesByCategory(categoryName);
    }
    
    return result;
  } catch (error) {
    console.error("Error getting all courses:", error);
    throw error;
  }
};

// Anhadida funcion de utilidad para asignar escuelas a cursos
const assignSchoolsToCourses = async () => {
  try {
    // Get courses without school_id and schools
    const [coursesWithoutSchool] = await pool.query(
      `SELECT id FROM mooc_catalog WHERE school_id IS NULL`
    );
    const [schools] = await pool.query(`SELECT id FROM mooc_schools`);
    
    if (coursesWithoutSchool.length === 0 || schools.length === 0) {
      return { assigned: 0 };
    }
    
    // Distribute courses among schools randomly
    let assignedCount = 0;
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      for (const course of coursesWithoutSchool) {
        // Pick a random school
        const randomSchool = schools[Math.floor(Math.random() * schools.length)];
        
        await connection.query(
          `UPDATE mooc_catalog SET school_id = ? WHERE id = ?`,
          [randomSchool.id, course.id]
        );
        
        assignedCount++;
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    
    return { assigned: assignedCount };
  } catch (error) {
    console.error("Error assigning schools to courses:", error);
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