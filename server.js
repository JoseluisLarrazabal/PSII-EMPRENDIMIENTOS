import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';  // Importa bcryptjs

dotenv.config();

if (!process.env.DB_SERVER || !process.env.DB_DATABASE || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.error('Faltan variables de entorno necesarias para la conexión a la base de datos.');
  process.exit(1);
}

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};


// Ruta para insertar en la tabla revenue
app.post('/revenue', async (req, res) => {
  const { nombre, contacto, institucion, descripcion } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Insertar datos en la tabla 'revenue'
    await connection.execute(`
      INSERT INTO revenue (nombre, nro_contacto, nombre_proyecto_institucion, descripcion_apoyo)
      VALUES (?, ?, ?, ?)
    `, [nombre, contacto, institucion, descripcion]);

    res.status(200).json({ message: 'Datos de contacto guardados exitosamente' });

    await connection.end();
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
    const connection = await mysql.createConnection(dbConfig);

    // Insertar el proyecto en la tabla "partners"
    await connection.execute(`
      INSERT INTO partners (nombre_estudiante, semestre, carrera, contacto, nombre_proyecto, descripcion_proyecto, tipo_proyecto, requerimiento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [nombre_estudiante, semestre, carrera, contacto, nombre_proyecto, descripcion_proyecto, tipo_proyecto, requerimiento]);

    res.status(200).json({ message: 'Proyecto registrado exitosamente' });

    await connection.end();
  } catch (err) {
    console.error('Error al insertar en partners:', err);
    res.status(500).json({ message: 'Hubo un problema al guardar el proyecto.' });
  }
});




// Ruta para insertar en la tabla usuarios (usuarios de la aplicación)
app.post('/usuario', async (req, res) => {
  const { email, password, rol } = req.body; // Ahora recibimos también 'rol'

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Contraseña encriptada:', hashedPassword);

    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(`
      INSERT INTO usuario (usuario, contrasena, rol)
      VALUES (?, ?, ?)
    `, [email, hashedPassword, rol]); // Aquí mandamos email como 'usuario'

    res.status(200).json({ message: 'Usuario registrado exitosamente' });

    await connection.end();
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
    const connection = await mysql.createConnection(dbConfig);

    // Obtener el usuario de la base de datos
    const [rows] = await connection.execute('SELECT * FROM usuario WHERE usuario = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    const user = rows[0];

    // Comparar la contraseña encriptada con la contraseña proporcionada
    const isMatch = await bcrypt.compare(password, user.contrasena);

    if (isMatch) {
      res.status(200).json({ message: "Login exitoso." });
    } else {
      res.status(401).json({ message: "Credenciales incorrectas." });
    }

    await connection.end();
  } catch (err) {
    console.error('Error al intentar iniciar sesión:', err);
    res.status(500).json({ message: "Hubo un error al procesar la solicitud." });
  }
});

// Ruta para obtener mentores
app.get('/mentors', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(`
      SELECT id, nombre, telefono, area_experiencia, disponibilidad
      FROM mentor
    `);

    console.log('Mentores obtenidos:', rows);
    res.status(200).json(rows);

    await connection.end();
  } catch (err) {
    console.error('Error al obtener mentores:', err);
    res.status(500).json({ message: 'Hubo un problema al obtener los mentores.' });
  }
});


// Nueva ruta para insertar en 'mentoring'
app.post('/mentoring', async (req, res) => {
  const { mentorId, meInteresa } = req.body; // Recibimos el ID del mentor y si le interesa o no

  if (mentorId === undefined || meInteresa === undefined) {
    return res.status(400).json({ message: "Faltan datos requeridos." });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Insertar en la tabla mentoring
    await connection.execute(`
      INSERT INTO mentoring (mentor_id, me_interesa, no_me_interesa)
      VALUES (?, ?, ?)
    `, [
      mentorId,
      meInteresa ? 1 : 0,    // si meInteresa es true, insertamos 1 en me_interesa
      meInteresa ? 0 : 1     // si meInteresa es true, insertamos 0 en no_me_interesa
    ]);

    res.status(200).json({ message: 'Mentoring guardado exitosamente' });

    await connection.end();
  } catch (err) {
    console.error('Error al insertar en mentoring:', err);
    res.status(500).json({ message: 'Hubo un problema al guardar el mentoring.' });
  }
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
