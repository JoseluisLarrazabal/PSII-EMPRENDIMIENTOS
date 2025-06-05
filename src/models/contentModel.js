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
const createCourseWithContent = async (courseData) => {
  const connection = await pool.getConnection();
  try {
    console.log(
      "Iniciando creación de curso con datos:",
      JSON.stringify(courseData, null, 2)
    );

    // Validaciones iniciales
    if (
      !courseData.title ||
      !courseData.provider ||
      !courseData.image_url ||
      !courseData.logo_url ||
      !courseData.type ||
      !courseData.category
    ) {
      console.error("Faltan campos requeridos:", {
        title: !courseData.title,
        provider: !courseData.provider,
        image_url: !courseData.image_url,
        logo_url: !courseData.logo_url,
        type: !courseData.type,
        category: !courseData.category,
      });
      throw new Error("Faltan campos requeridos en los datos del curso");
    }

    await connection.beginTransaction();

    // 1. Insertar en la tabla curso
    console.log("Insertando en tabla curso...");
    const [cursoResult] = await connection.query(
      `INSERT INTO curso (titulo, descripcion, estado, mentor_id) VALUES (?, ?, ?, ?)`, // 🔥 CAMBIO: mentor_id no usuario_mentor_id
      [
        courseData.title,
        courseData.description || "",
        courseData.estado || "borrador",
        courseData.mentor_id || null,
      ]
    );
    const cursoId = cursoResult.insertId;
    console.log("Curso creado con ID:", cursoId);

    // 2. Insertar en mooc_catalog
    console.log("Insertando en mooc_catalog...");
    console.log("Datos para mooc_catalog:", {
      title: courseData.title,
      provider: courseData.provider,
      image_url: courseData.image_url,
      logo_url: courseData.logo_url,
      type: courseData.type,
      category: courseData.category,
      is_popular: courseData.is_popular || false,
      is_new: courseData.is_new || false,
      is_trending: courseData.is_trending || false,
      curso_id: cursoId,
    });

    // En contentModel.js - MODIFICA la inserción en mooc_catalog
    const [catalogResult] = await connection.query(
      `INSERT INTO mooc_catalog (
    title, provider, image_url, logo_url, type, 
    category, is_popular, is_new, is_trending,
    curso_id, has_certificate
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ]
    );
    console.log("Catálogo creado con ID:", catalogResult.insertId);

    // 3. Insertar lecciones
    if (courseData.slides && courseData.slides.length > 0) {
      for (let i = 0; i < courseData.slides.length; i++) {
        const slide = courseData.slides[i];
        if (!slide.title) {
          throw new Error(`La lección ${i + 1} debe tener un título`);
        }
        console.log("Procesando lección:", i + 1, slide.title);

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
            slide.video_url || null, // 🔥 Los datos ya vienen con video_url
            slide.embed_url || null, // 🔥 Los datos ya vienen con embed_url
          ]
        );
        const leccionId = leccionResult.insertId;
        console.log("Lección creada con ID:", leccionId);

        // 4. Insertar recursos si existen
        if (slide.recursos && slide.recursos.length > 0) {
          for (const recurso of slide.recursos) {
            if (!recurso.nombre || !recurso.url_archivo) {
              throw new Error(
                `El recurso de la lección ${i + 1} debe tener nombre y URL`
              );
            }
            await connection.query(
              `INSERT INTO recursos (
            leccion_id, nombre, url_archivo, tipo
          ) VALUES (?, ?, ?, ?)`,
              [
                leccionId,
                recurso.nombre,
                recurso.url_archivo,
                recurso.tipo || "link",
              ]
            );
          }
          console.log("Recursos insertados para lección:", leccionId);
        }

        // 5. Insertar quiz si existe
        if (
          slide.quiz &&
          slide.quiz.preguntas &&
          slide.quiz.preguntas.length > 0
        ) {
          // 🔥 ESTRUCTURA CORRECTA
          const [quizResult] = await connection.query(
            `INSERT INTO quizzes (
          leccion_id, titulo, instrucciones
        ) VALUES (?, ?, ?)`,
            [
              leccionId,
              slide.quiz.titulo || "Quiz de la Lección",
              slide.quiz.instrucciones || "",
            ]
          );
          const quizId = quizResult.insertId;
          console.log("Quiz creado con ID:", quizId);

          // 6. Insertar preguntas del quiz
          for (let j = 0; j < slide.quiz.preguntas.length; j++) {
            const pregunta = slide.quiz.preguntas[j];
            if (!pregunta.texto_pregunta) {
              throw new Error(
                `La pregunta ${j + 1} del quiz de la lección ${
                  i + 1
                } debe tener texto`
              );
            }
            const [preguntaResult] = await connection.query(
              `INSERT INTO preguntas_quiz (
            quiz_id, texto_pregunta, tipo_pregunta, orden
          ) VALUES (?, ?, ?, ?)`,
              [
                quizId,
                pregunta.texto_pregunta,
                pregunta.tipo_pregunta || "multiple-choice",
                j,
              ]
            );
            const preguntaId = preguntaResult.insertId;

            // 7. Insertar opciones de respuesta
            if (pregunta.opciones && pregunta.opciones.length > 0) {
              if (pregunta.opciones.length < 2) {
                throw new Error(
                  `La pregunta ${j + 1} del quiz de la lección ${
                    i + 1
                  } debe tener al menos 2 opciones`
                );
              }
              for (const opcion of pregunta.opciones) {
                if (!opcion.texto_opcion) {
                  throw new Error(
                    `Las opciones de la pregunta ${
                      j + 1
                    } del quiz de la lección ${i + 1} deben tener texto`
                  );
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
          console.log("Preguntas y opciones insertadas para quiz:", quizId);
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

// Obtener un curso con todo su contenido
const getCourseWithContent = async (cursoId) => {
  try {
    // 1. Obtener información del curso
    const [curso] = await pool.query(`SELECT * FROM curso WHERE id = ?`, [
      cursoId,
    ]);

    if (!curso[0]) return null;

    // 2. Obtener lecciones ordenadas
    const [lecciones] = await pool.query(
      `SELECT * FROM lecciones WHERE curso_id = ? ORDER BY orden`,
      [cursoId]
    );

    // 3. Para cada lección, obtener sus recursos y quiz
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

    return {
      ...curso[0],
      lecciones,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  initializeContentTables,
  createCourseWithContent,
  getCourseWithContent,
};
