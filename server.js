import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'; //solución

<<<<<<< HEAD
// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
=======
const PORT = config.port || 8000;
>>>>>>> JoseLuisBackend

// Cargar el archivo .env desde /backend
dotenv.config({ path: path.resolve(__dirname, 'backend', '.env') });

// Verificación de variables de entorno
if (!process.env.DB_SERVER || !process.env.DB_DATABASE || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.error('Faltan variables de entorno necesarias para la conexión a la base de datos.');
  process.exit(1);
}

const app = express();
const port = 8000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Ruta para el formulario de contacto
app.post('/api/contacto', async (req, res) => {
  const {
    nombre: nombres,
    email: correo,
    telefono,
    tipo_consulta: seleccion,
    mensaje
  } = req.body;

  console.log('Datos recibidos:', req.body);

  try {
    const connection = await pool.getConnection();

    const query = `
      INSERT INTO contactos (envio_formulario, nombres, correo, telefono, seleccion, mensaje_enviado)
      VALUES (NOW(), ?, ?, ?, ?, ?)
    `;

    const [results] = await connection.execute(query, [nombres, correo, telefono, seleccion, mensaje]);
    connection.release();

    res.json({ success: true, message: '¡Formulario enviado correctamente!' });
  } catch (err) {
    console.error('Error al guardar contacto:', err);
    res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
  }
});


// Rutas para CRUD de la tabla empresas_servicios
app.get("/api/empresas_servicios", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM empresas_servicios");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error leyendo servicios:", err.message);
    res.status(500).send("Error leyendo servicios");
  }
});

app.post("/api/empresas_servicios", async (req, res) => {
  const { imagen_url, titulo, descripcion, subtitulo, servicios } = req.body;
  
  try {
    const [result] = await pool.query(
      "INSERT INTO empresas_servicios (imagen_url, titulo, descripcion, subtitulo, servicios) VALUES (?, ?, ?, ?, ?)",
      [imagen_url, titulo, descripcion, subtitulo, servicios]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("❌ Error creando servicio:", err.message);
    res.status(500).send("Error creando servicio");
  }
});

app.get("/api/empresas_servicios/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await pool.query("SELECT * FROM empresas_servicios WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).send("Servicio no encontrado");
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error obteniendo servicio:", err.message);
    res.status(500).send("Error obteniendo servicio");
  }
});

app.put("/api/empresas_servicios/:id", async (req, res) => {
  const { id } = req.params;
  const { imagen_url, titulo, descripcion, subtitulo, servicios } = req.body;
  
  try {
    await pool.query(
      "UPDATE empresas_servicios SET imagen_url = ?, titulo = ?, descripcion = ?, subtitulo = ?, servicios = ? WHERE id = ?",
      [imagen_url, titulo, descripcion, subtitulo, servicios, id]
    );
    res.status(200).json({ message: "Servicio actualizado" });
  } catch (err) {
    console.error("❌ Error actualizando servicio:", err.message);
    res.status(500).send("Error actualizando servicio");
  }
});

app.delete("/api/empresas_servicios/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query("DELETE FROM empresas_servicios WHERE id = ?", [id]);
    res.status(200).json({ message: "Servicio eliminado" });
  } catch (err) {
    console.error("❌ Error eliminando servicio:", err.message);
    res.status(500).send("Error eliminando servicio");
  }
});

// Rutas para CRUD de Inspiring
app.get("/api/inspiring", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM inspiring");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error leyendo 'inspiring':", err.message);
    res.status(500).send("Error leyendo Inspiring");
  }
});

// POST - Crear nuevo inspiring
app.post("/api/inspiring", async (req, res) => {
  try {
    const { titulo, speaker, descripcion, imagen_url, video_url, contacto_email } = req.body;
    const [result] = await pool.query(
      "INSERT INTO inspiring (titulo, speaker, descripcion, imagen_url, video_url, contacto_email, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [titulo, speaker, descripcion, imagen_url, video_url, contacto_email, new Date()]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("Error creando inspiring:", err);
    res.status(500).send("Error creando inspiring");
  }
});

// PUT - Actualizar inspiring
app.put("/api/inspiring/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, speaker, descripcion, imagen_url, video_url, contacto_email } = req.body;
    await pool.query(
      "UPDATE inspiring SET titulo = ?, speaker = ?, descripcion = ?, imagen_url = ?, video_url = ?, contacto_email = ? WHERE id = ?",
      [titulo, speaker, descripcion, imagen_url, video_url, contacto_email, id]
    );
    res.status(200).send("Inspiring actualizado");
  } catch (err) {
    console.error("Error actualizando inspiring:", err);
    res.status(500).send("Error actualizando inspiring");
  }
});

// DELETE - Eliminar inspiring
app.delete("/api/inspiring/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM inspiring WHERE id = ?", [id]);
    res.status(200).send("Inspiring eliminado");
  } catch (err) {
    console.error("Error eliminando inspiring:", err);
    res.status(500).send("Error eliminando inspiring");
  }
});

// GET all challengers
app.get("/api/challenger", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM challenger");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error leyendo 'challenger':", err.message);
    res.status(500).send("Error leyendo Challenger");
  }
});

// GET single challenger
app.get("/api/challenger/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM challenger WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send("Challenger no encontrado");
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error leyendo challenger:", err.message);
    res.status(500).send("Error obteniendo challenger");
  }
});

// CREATE challenger
app.post("/api/challenger", async (req, res) => {
  try {
    const { title, image_url, fecha, hora_inicio, hora_fin, contacto_email, destacado } = req.body;
    const [result] = await pool.query(
      "INSERT INTO challenger (title, image_url, fecha, hora_inicio, hora_fin, contacto_email, destacado) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, image_url, fecha, hora_inicio, hora_fin, contacto_email, destacado || false]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error("❌ Error creando challenger:", err.message);
    res.status(500).send("Error creando challenger");
  }
});

// UPDATE challenger
app.put("/api/challenger/:id", async (req, res) => {
  try {
    const { title, image_url, fecha, hora_inicio, hora_fin, contacto_email, destacado } = req.body;
    const [result] = await pool.query(
      "UPDATE challenger SET title = ?, image_url = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, contacto_email = ?, destacado = ? WHERE id = ?",
      [title, image_url, fecha, hora_inicio, hora_fin, contacto_email, destacado || false, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send("Challenger no encontrado");
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    console.error("❌ Error actualizando challenger:", err.message);
    res.status(500).send("Error actualizando challenger");
  }
});

// DELETE challenger
app.delete("/api/challenger/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM challenger WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).send("Challenger no encontrado");
    }
    res.status(204).send();
  } catch (err) {
    console.error("❌ Error eliminando challenger:", err.message);
    res.status(500).send("Error eliminando challenger");
  }
});

// Ruta para insertar en la tabla revenue
app.post('/revenue', async (req, res) => {
  const { nombre, contacto, institucion, descripcion } = req.body;

  try {
    const connection = await pool.getConnection();

    await connection.execute(`
      INSERT INTO revenue (nombre, nro_contacto, nombre_proyecto_institucion, descripcion_apoyo)
      VALUES (?, ?, ?, ?)
    `, [nombre, contacto, institucion, descripcion]);

    connection.release();
    res.status(200).json({ message: 'Datos de contacto guardados exitosamente' });
  } catch (err) {
    console.error('Error al insertar en revenue:', err);
    res.status(500).json({ message: 'Hubo un problema al guardar los datos en revenue.' });
  }
});

// Ruta para insertar un nuevo "partner" (proyecto)
app.post('/proyectos', async (req, res) => {
  const {
    nombre_estudiante,
    semestre,
    carrera,
    contacto,
    nombre_proyecto,
    descripcion_proyecto,
    tipo_proyecto,
    requerimiento,
  } = req.body;

  try {
    const connection = await pool.getConnection();

    await connection.execute(`
      INSERT INTO partners (nombre_estudiante, semestre, carrera, contacto, nombre_proyecto, descripcion_proyecto, tipo_proyecto, requerimiento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [nombre_estudiante, semestre, carrera, contacto, nombre_proyecto, descripcion_proyecto, tipo_proyecto, requerimiento]);

    connection.release();
    res.status(200).json({ message: 'Proyecto registrado exitosamente' });
  } catch (err) {
    console.error('Error al insertar en partners:', err);
    res.status(500).json({ message: 'Hubo un problema al guardar el proyecto.' });
  }
});

// Ruta para insertar en la tabla usuarios
app.post('/usuario', async (req, res) => {
  const { email, password, rol } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await pool.getConnection();

    await connection.execute(`
      INSERT INTO usuario (usuario, contrasena, rol)
      VALUES (?, ?, ?)
    `, [email, hashedPassword, rol]);

    connection.release();
    res.status(200).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error al insertar en usuario:', err);
    res.status(500).json({ message: 'Hubo un problema al registrar el usuario.' });
  }
});

// Ruta para login de usuarios
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Por favor, ingresa un correo y una contraseña." });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM usuario WHERE usuario = ?', [email]);
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.contrasena);

    if (isMatch) {
      // Usa una clave secreta directamente (solo para desarrollo)
      const secretKey = 'tu_clave_secreta_fuerte_para_desarrollo_123';
      
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.usuario,
          rol: user.rol 
        }, 
        secretKey,  // Usamos la clave directamente
        { expiresIn: '100y' }
      );

      res.status(200).json({ 
        message: "Login exitoso.",
        user: {
          id: user.id,
          email: user.usuario,
          rol: user.rol
        },
        token
      });
    } else {
      res.status(401).json({ message: "Credenciales incorrectas." });
    }
  } catch (err) {
    console.error('Error al intentar iniciar sesión:', err);
    res.status(500).json({ 
      message: "Hubo un error al procesar la solicitud.",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
  }
});

// Ruta para obtener mentores
app.get('/mentors', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(`
      SELECT id, image_url, nombre, telefono, area_experiencia, disponibilidad
      FROM mentor
    `);
    connection.release();

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error al obtener mentores:', err);
    res.status(500).json({ message: 'Hubo un problema al obtener los mentores.' });
  }
});

// Ruta para verificar autenticación
app.get('/verify-auth', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    // Verifica el token (usa la misma clave secreta que para firmar)
    jwt.verify(token, 'tu_clave_secreta_fuerte_para_desarrollo_123');
    res.json({ isAuthenticated: true });
  } catch (err) {
    res.json({ isAuthenticated: false });
  }
});

// Crear nuevo mentor
app.post('/mentors', async (req, res) => {
  try {
    const { nombre, telefono, area_experiencia, disponibilidad, image_url } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO mentor (usuario_id, nombre, telefono, area_experiencia, disponibilidad, image_url) VALUES (1, ?, ?, ?, ?, ?)',
      [nombre, telefono, area_experiencia, disponibilidad, image_url]
    );
    connection.release();
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Error al crear mentor:', err);
    res.status(500).json({ message: 'Hubo un problema al crear el mentor.' });
  }
});

// Actualizar mentor
app.put('/mentors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, area_experiencia, disponibilidad, image_url } = req.body;
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE mentor SET nombre = ?, telefono = ?, area_experiencia = ?, disponibilidad = ?, image_url = ? WHERE id = ?',
      [nombre, telefono, area_experiencia, disponibilidad, image_url, id]
    );
    connection.release();
    res.status(200).json({ message: 'Mentor actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar mentor:', err);
    res.status(500).json({ message: 'Hubo un problema al actualizar el mentor.' });
  }
});

// Eliminar mentor
app.delete('/mentors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM mentor WHERE id = ?', [id]);
    connection.release();
    res.status(200).json({ message: 'Mentor eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar mentor:', err);
    res.status(500).json({ message: 'Hubo un problema al eliminar el mentor.' });
  }
});

// Ruta para insertar en 'mentoring'
app.post('/mentoring', async (req, res) => {
  const { mentorId, meInteresa } = req.body;

  if (mentorId === undefined || meInteresa === undefined) {
    return res.status(400).json({ message: "Faltan datos requeridos." });
  }

  try {
    const connection = await pool.getConnection();
    await connection.execute(`
      INSERT INTO mentoring (mentor_id, me_interesa, no_me_interesa)
      VALUES (?, ?, ?)
    `, [mentorId, meInteresa ? 1 : 0, meInteresa ? 0 : 1]);
    connection.release();

    res.status(200).json({ message: 'Mentoring guardado exitosamente' });
  } catch (err) {
    console.error('Error al insertar en mentoring:', err);
    res.status(500).json({ message: 'Hubo un problema al guardar el mentoring.' });
  }
});

// Rutas para CRUD de Eventos
app.get('/api/eventos', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM eventos ORDER BY fecha_evento, hora');
    connection.release();
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener eventos:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener los eventos',
      error: err.message 
    });
  }
});

// Rutas para CRUD de Eventos
app.post('/api/eventos', async (req, res) => {
  const { titulo, descripcion, fecha_evento, hora, lugar, administrador_id } = req.body;
  
  // Validación básica de campos requeridos
  if (!titulo || !fecha_evento || !lugar) {
    return res.status(400).json({ 
      message: 'Faltan campos requeridos: título, fecha_evento y lugar son obligatorios' 
    });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      // Corregido: ahora hay 6 columnas y 6 valores
      'INSERT INTO eventos (titulo, descripcion, fecha_evento, hora, lugar) VALUES (?, ?, ?, ?, ?)',
      [
        titulo, 
        descripcion || null, 
        fecha_evento, 
        hora || null, 
        lugar || null
      ]
    );
    connection.release();
    
    console.log('Evento creado:', { id: result.insertId, ...req.body });
    
    res.status(201).json({ 
      success: true,
      id: result.insertId, 
      ...req.body 
    });
  } catch (err) {
    console.error('Error al crear evento:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear el evento',
      error: err.message,
      sql: err.sql // Incluimos la consulta SQL en la respuesta para depuración
    });
  }
});

app.put('/api/eventos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha_evento, hora, lugar } = req.body;
  
  console.log("Datos recibidos para actualizar:", req.body);
  console.log("ID a actualizar:", id);

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `UPDATE eventos 
       SET titulo = ?, descripcion = ?, fecha_evento = ?, hora = ?, lugar = ?
       WHERE id = ?`,
      [titulo, descripcion, fecha_evento, hora, lugar, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    
    res.json({ message: 'Evento actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar evento:', err);
    res.status(500).json({ message: 'Error al actualizar el evento' });
  }
});

app.delete('/api/eventos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'DELETE FROM eventos WHERE id = ?',
      [id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar evento:', err);
    res.status(500).json({ message: 'Error al eliminar el evento' });
  }
});

// Ruta para verificar si el correo existe
app.post('/api/verify-email', async (req, res) => {
  const { email } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM usuario WHERE usuario = ?', [email]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Correo electrónico no encontrado' 
      });
    }

    // En un sistema real, aquí enviarías un correo con un token de recuperación
    res.json({ 
      success: true,
      message: 'Correo verificado. Puedes establecer una nueva contraseña.',
      email: email
    });
  } catch (err) {
    console.error('Error al verificar correo:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error al verificar el correo electrónico',
      error: err.message 
    });
  }
});

// Ruta para actualizar la contraseña
app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE usuario SET contrasena = ? WHERE usuario = ?',
      [hashedPassword, email]
    );
    connection.release();

    res.json({ 
      success: true,
      message: 'Contraseña actualizada exitosamente' 
    });
  } catch (err) {
    console.error('Error al actualizar contraseña:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar la contraseña',
      error: err.message 
    });
  }
});



// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ message: 'Ocurrió un error en el servidor' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

export default app;