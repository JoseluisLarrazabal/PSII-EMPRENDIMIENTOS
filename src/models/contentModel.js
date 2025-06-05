const pool = require("../config/database");

// Inicializar tablas de contenido
const initializeContentTables = async () => {
  try {
    // 1. Tabla curso
    await pool.query(`
      CREATE TABLE IF NOT EXISTS curso (
        id INT NOT NULL AUTO_INCREMENT,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        estado ENUM('activo', 'inactivo', 'borrador') DEFAULT 'borrador',
        mentor_id INT DEFAULT NULL,  -- 🔥 CAMBIO: era administrador_id
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (mentor_id) REFERENCES mentor(id) ON DELETE SET NULL  -- 🔥 NUEVA FK
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    // 2. Tabla lecciones
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lecciones (
        id INT NOT NULL AUTO_INCREMENT,
        curso_id INT NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        orden INT NOT NULL,
        contenido_texto TEXT DEFAULT NULL,
        video_url VARCHAR(500) DEFAULT NULL,
        embed_url VARCHAR(500) DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (curso_id) REFERENCES curso(id) ON DELETE CASCADE,
        UNIQUE KEY uk_leccion_orden (curso_id, orden)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    // 3. Tabla recursos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recursos (
        id INT NOT NULL AUTO_INCREMENT,
        leccion_id INT NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        url_archivo VARCHAR(500) NOT NULL,
        tipo VARCHAR(50) DEFAULT 'link',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (leccion_id) REFERENCES lecciones(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    // 4. Tabla quizzes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INT NOT NULL AUTO_INCREMENT,
        leccion_id INT NOT NULL UNIQUE,
        titulo VARCHAR(255) DEFAULT 'Quiz de la Lección',
        instrucciones TEXT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (leccion_id) REFERENCES lecciones(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    // 5. Tabla preguntas_quiz
    await pool.query(`
      CREATE TABLE IF NOT EXISTS preguntas_quiz (
        id INT NOT NULL AUTO_INCREMENT,
        quiz_id INT NOT NULL,
        texto_pregunta TEXT NOT NULL,
        tipo_pregunta VARCHAR(50) DEFAULT 'multiple-choice',
        orden INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
        UNIQUE KEY uk_pregunta_orden (quiz_id, orden)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    // 6. Tabla opciones_respuesta
    await pool.query(`
      CREATE TABLE IF NOT EXISTS opciones_respuesta (
        id INT NOT NULL AUTO_INCREMENT,
        pregunta_id INT NOT NULL,
        texto_opcion TEXT NOT NULL,
        es_correcta TINYINT(1) DEFAULT '0',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (pregunta_id) REFERENCES preguntas_quiz(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    console.log("Tablas de contenido inicializadas correctamente");
  } catch (error) {
    console.error("Error inicializando tablas de contenido:", error);
    throw error;
  }
};

// Crear un nuevo curso con su contenido
// En contentModel.js - Versión corregida de createCourseWithContent
const createCourseWithContent = async (courseData) => {
  const connection = await pool.getConnection();
  try {
    console.log("Iniciando creación de curso con datos:", JSON.stringify(courseData, null, 2));

    await connection.beginTransaction();

    // 1. Insertar en la tabla curso
    console.log("Insertando en tabla curso...");
    const [cursoResult] = await connection.query(
      `INSERT INTO curso (
        titulo, 
        descripcion, 
        estado, 
        usuario_mentor_id,
        fecha_inicio,
        duracion,
        horas_esfuerzo,
        idioma,
        nivel,
        prerequisitos,
        certificado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        courseData.title,
        courseData.description || "",
        courseData.estado || "borrador",
        courseData.mentor_id || null,
        formatDateForMySQL(courseData.start_date),
        courseData.duration || null,
        courseData.effort_hours || null,
        courseData.language || 'Español',
        courseData.level || null,
        courseData.prerequisites || null,
        courseData.has_certificate ? 1 : 0
      ]
    );
    const cursoId = cursoResult.insertId;
    console.log("Curso creado con ID:", cursoId);

    // 2. Insertar en mooc_catalog
    const [catalogResult] = await connection.query(
      `INSERT INTO mooc_catalog (
        title, provider, image_url, logo_url, type, 
        category, is_popular, is_new, is_trending,
        curso_id, has_certificate, description,
        start_date, duration, effort_hours, 
        language, level, prerequisites, rating,
        mentor_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        cursoId,
        courseData.has_certificate || false,
        courseData.description || null,
        formatDateForMySQL(courseData.start_date),
        courseData.duration || null,
        courseData.effort_hours || null,
        courseData.language || null,
        courseData.level || null,
        courseData.prerequisites || null,
        courseData.rating || null,
        courseData.mentor_id || null
      ]
    );

    // 3. Insertar lecciones
    if (courseData.slides && courseData.slides.length > 0) {
      for (let i = 0; i < courseData.slides.length; i++) {
        const slide = courseData.slides[i];
        if (!slide.title) {
          throw new Error(`La lección ${i + 1} debe tener un título`);
        }

        const [leccionResult] = await connection.query(
          `INSERT INTO lecciones (
            curso_id, titulo, orden, contenido_texto, 
            video_url, embed_url
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            cursoId,
            slide.title,
            i,
            slide.content || "",
            slide.video_url || null,
            slide.embed_url || null
          ]
        );
        const leccionId = leccionResult.insertId;

        // 4. Insertar recursos si existen
        if (slide.recursos && slide.recursos.length > 0) {
          for (const recurso of slide.recursos) {
            if (!recurso.nombre || !recurso.url_archivo) {
              throw new Error(`El recurso de la lección ${i + 1} debe tener nombre y URL`);
            }
            await connection.query(
              `INSERT INTO recursos (
                leccion_id, nombre, url_archivo, tipo
              ) VALUES (?, ?, ?, ?)`,
              [
                leccionId,
                recurso.nombre,
                recurso.url_archivo,
                recurso.tipo || "link"
              ]
            );
          }
        }

        // 5. Insertar quiz si existe
        if (slide.quiz && slide.quiz.preguntas && slide.quiz.preguntas.length > 0) {
          const [quizResult] = await connection.query(
            `INSERT INTO quizzes (
              leccion_id, titulo, instrucciones
            ) VALUES (?, ?, ?)`,
            [
              leccionId,
              slide.quiz.titulo || "Quiz de la Lección",
              slide.quiz.instrucciones || ""
            ]
          );
          const quizId = quizResult.insertId;

          // 6. Insertar preguntas del quiz
          for (let j = 0; j < slide.quiz.preguntas.length; j++) {
            const pregunta = slide.quiz.preguntas[j];
            if (!pregunta.texto_pregunta) {
              throw new Error(`La pregunta ${j + 1} del quiz de la lección ${i + 1} debe tener texto`);
            }
            const [preguntaResult] = await connection.query(
              `INSERT INTO preguntas_quiz (
                quiz_id, texto_pregunta, tipo_pregunta, orden
              ) VALUES (?, ?, ?, ?)`,
              [
                quizId,
                pregunta.texto_pregunta,
                pregunta.tipo_pregunta || "multiple-choice",
                j
              ]
            );
            const preguntaId = preguntaResult.insertId;

            // 7. Insertar opciones de respuesta
            if (pregunta.opciones && pregunta.opciones.length > 0) {
              for (const opcion of pregunta.opciones) {
                if (!opcion.texto_opcion) {
                  throw new Error(`Las opciones de la pregunta ${j + 1} del quiz de la lección ${i + 1} deben tener texto`);
                }
                await connection.query(
                  `INSERT INTO opciones_respuesta (
                    pregunta_id, texto_opcion, es_correcta
                  ) VALUES (?, ?, ?)`,
                  [preguntaId, opcion.texto_opcion, opcion.es_correcta ? 1 : 0]
                );
              }
            }
          }
        }
      }
    }

    await connection.commit();
    console.log("Transacción completada exitosamente");
    return { cursoId, catalogId: catalogResult.insertId };
  } catch (error) {
    console.error("Error en createCourseWithContent:", error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


const formatDateForMySQL = (dateString) => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    // Formatear a YYYY-MM-DD HH:MM:SS
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return null;
  }
};

// Función faltante: getCourseWithContent
const getCourseWithContent = async (cursoId) => {
  try {
    // 1. Obtener información del curso
    const [curso] = await pool.query(`SELECT * FROM curso WHERE id = ?`, [cursoId]);

    if (!curso[0]) return null;

    // 2. Obtener información de mooc_catalog
    const [catalogInfo] = await pool.query(
      `SELECT * FROM mooc_catalog WHERE curso_id = ?`,
      [cursoId]
    );

    // 3. Obtener lecciones ordenadas
    const [lecciones] = await pool.query(
      `SELECT * FROM lecciones WHERE curso_id = ? ORDER BY orden`,
      [cursoId]
    );

    // 4. Para cada lección, obtener sus recursos y quiz
    for (let leccion of lecciones) {
      // Obtener recursos
      const [recursos] = await pool.query(
        `SELECT * FROM recursos WHERE leccion_id = ?`,
        [leccion.id]
      );
      leccion.recursos = recursos;

      // Obtener quiz si existe
      const [quizzes] = await pool.query(
        `SELECT * FROM quizzes WHERE leccion_id = ?`,
        [leccion.id]
      );

      if (quizzes.length > 0) {
        const quiz = quizzes[0];
        // Obtener preguntas del quiz
        const [preguntas] = await pool.query(
          `SELECT * FROM preguntas_quiz WHERE quiz_id = ? ORDER BY orden`,
          [quiz.id]
        );

        // Para cada pregunta, obtener sus opciones
        for (let pregunta of preguntas) {
          const [opciones] = await pool.query(
            `SELECT * FROM opciones_respuesta WHERE pregunta_id = ?`,
            [pregunta.id]
          );
          pregunta.opciones = opciones;
        }

        quiz.preguntas = preguntas;
        leccion.quiz = quiz;
      }
    }

    // Combinar datos de ambas tablas
    const cursoCompleto = {
      ...curso[0],
      ...(catalogInfo[0] || {}),
      lecciones,
      // Mapear slides para el frontend
      slides: lecciones.map((leccion) => ({
        title: leccion.titulo,
        content: leccion.contenido_texto || "",
        videoUrl: leccion.video_url || "",
        embedUrl: leccion.embed_url || "",
        recursos: leccion.recursos || [],
        quiz: leccion.quiz ? {
          titulo: leccion.quiz.titulo,
          instrucciones: leccion.quiz.instrucciones,
          preguntas: leccion.quiz.preguntas || []
        } : null
      }))
    };

    return cursoCompleto;
  } catch (error) {
    throw error;
  }
};

// Función updateCourseWithContent completa
const updateCourseWithContent = async (catalogId, courseData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Primero obtener el curso_id desde mooc_catalog
    const [catalogInfo] = await connection.query(
      `SELECT curso_id FROM mooc_catalog WHERE id = ?`,
      [catalogId]
    );

    if (catalogInfo.length === 0) {
      throw new Error("No se encontró el curso en el catálogo");
    }

    const cursoId = catalogInfo[0].curso_id;

    // 2. Actualizar tabla curso con formato de fecha corregido
    if (cursoId) {
      await connection.query(
        `UPDATE curso 
         SET titulo = ?, 
             descripcion = ?, 
             estado = ?,
             fecha_inicio = ?,
             duracion = ?,
             horas_esfuerzo = ?,
             idioma = ?,
             nivel = ?,
             prerequisitos = ?,
             certificado = ?
         WHERE id = ?`,
        [
          courseData.title,
          courseData.description || "",
          courseData.estado || "borrador",
          formatDateForMySQL(courseData.start_date),
          courseData.duration || null,
          courseData.effort_hours || null,
          courseData.language || "Español",
          courseData.level || null,
          courseData.prerequisites || null,
          courseData.has_certificate ? 1 : 0,
          cursoId
        ]
      );
    }

    // 3. Actualizar mooc_catalog con TODOS los campos
    await connection.query(
      `UPDATE mooc_catalog SET
        title = ?, 
        provider = ?, 
        image_url = ?, 
        logo_url = ?,
        type = ?, 
        category = ?, 
        is_popular = ?, 
        is_new = ?,
        is_trending = ?, 
        has_certificate = ?, 
        description = ?,
        start_date = ?,
        duration = ?,
        effort_hours = ?,
        language = ?,
        level = ?,
        prerequisites = ?,
        rating = ?
       WHERE id = ?`,
      [
        courseData.title,
        courseData.provider,
        courseData.image_url,
        courseData.logo_url,
        courseData.type,
        courseData.category,
        courseData.is_popular ? 1 : 0,
        courseData.is_new ? 1 : 0,
        courseData.is_trending ? 1 : 0,
        courseData.has_certificate ? 1 : 0,
        courseData.description || null,
        formatDateForMySQL(courseData.start_date),
        courseData.duration || null,
        courseData.effort_hours || null,
        courseData.language || null,
        courseData.level || null,
        courseData.prerequisites || null,
        courseData.rating || null,
        catalogId
      ]
    );

    // Solo procesar lecciones si hay un curso_id válido
    if (cursoId) {
      // 4. Eliminar lecciones existentes
      await connection.query(`DELETE FROM lecciones WHERE curso_id = ?`, [cursoId]);

      // 5. Insertar lecciones actualizadas
      if (courseData.slides && courseData.slides.length > 0) {
        for (let i = 0; i < courseData.slides.length; i++) {
          const slide = courseData.slides[i];

          const [leccionResult] = await connection.query(
            `INSERT INTO lecciones (
              curso_id, titulo, orden, contenido_texto, 
              video_url, embed_url
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              cursoId,
              slide.title,
              i,
              slide.content || "",
              slide.video_url || null,
              slide.embed_url || null
            ]
          );
          const leccionId = leccionResult.insertId;

          // 6. Insertar recursos
          if (slide.recursos && slide.recursos.length > 0) {
            for (const recurso of slide.recursos) {
              await connection.query(
                `INSERT INTO recursos (
                  leccion_id, nombre, url_archivo, tipo
                ) VALUES (?, ?, ?, ?)`,
                [
                  leccionId,
                  recurso.nombre,
                  recurso.url_archivo,
                  recurso.tipo || "link"
                ]
              );
            }
          }

          // 7. Insertar quiz si existe
          if (slide.quiz && slide.quiz.preguntas && slide.quiz.preguntas.length > 0) {
            const [quizResult] = await connection.query(
              `INSERT INTO quizzes (
                leccion_id, titulo, instrucciones
              ) VALUES (?, ?, ?)`,
              [
                leccionId,
                slide.quiz.titulo || "Quiz de la Lección",
                slide.quiz.instrucciones || ""
              ]
            );
            const quizId = quizResult.insertId;

            // Insertar preguntas y opciones
            for (let j = 0; j < slide.quiz.preguntas.length; j++) {
              const pregunta = slide.quiz.preguntas[j];
              const [preguntaResult] = await connection.query(
                `INSERT INTO preguntas_quiz (
                  quiz_id, texto_pregunta, tipo_pregunta, orden
                ) VALUES (?, ?, ?, ?)`,
                [
                  quizId,
                  pregunta.texto_pregunta,
                  pregunta.tipo_pregunta || "multiple-choice",
                  j
                ]
              );
              const preguntaId = preguntaResult.insertId;

              if (pregunta.opciones && pregunta.opciones.length > 0) {
                for (const opcion of pregunta.opciones) {
                  await connection.query(
                    `INSERT INTO opciones_respuesta (
                      pregunta_id, texto_opcion, es_correcta
                    ) VALUES (?, ?, ?)`,
                    [
                      preguntaId,
                      opcion.texto_opcion,
                      opcion.es_correcta ? 1 : 0
                    ]
                  );
                }
              }
            }
          }
        }
      }
    } else {
      // Si no hay curso_id, usar mooc_course_slides
      await connection.query(
        `DELETE FROM mooc_course_slides WHERE course_id = ?`,
        [catalogId]
      );

      if (courseData.slides && courseData.slides.length > 0) {
        for (let i = 0; i < courseData.slides.length; i++) {
          const slide = courseData.slides[i];
          await connection.query(
            `INSERT INTO mooc_course_slides 
              (course_id, title, content, video_url, embed_url, quiz, resources, slide_order)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              catalogId,
              slide.title,
              slide.content || "",
              slide.video_url || null,
              slide.embed_url || null,
              JSON.stringify(slide.quiz || []),
              JSON.stringify(slide.recursos || []),
              i
            ]
          );
        }
      }
    }

    await connection.commit();
    console.log("✅ Curso actualizado exitosamente");
    return true;
  } catch (error) {
    console.error("Error en updateCourseWithContent:", error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Exportar la nueva función
module.exports = {
  initializeContentTables,
  createCourseWithContent,
  getCourseWithContent,
  updateCourseWithContent,
  formatDateForMySQL,
};
