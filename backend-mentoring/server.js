const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 4000;  // El puerto en el que escuchará tu backend

// Configuración de la conexión con MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mildelcastillo1213',  // Tu contraseña de la base de datos
  database: 'incuvalab',  // Nombre de la base de datos
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

app.use(cors());
app.use(express.json());  // Para procesar los datos JSON

// API para obtener los mentores
app.get('/api/mentores', (req, res) => {
  const query = `
    SELECT m.id, m.nombre, m.telefono, m.area_experiencia, m.disponibilidad, mt.me_interesa, mt.no_me_interesa
    FROM mentor m
    LEFT JOIN mentoring mt ON m.id = mt.mentor_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los mentores:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener los mentores' });
    }
    res.json({ success: true, data: results });
  });
});

// Endpoint para guardar la preferencia del mentor
app.post('/mentoring', (req, res) => {
  const { mentor_id, me_interesa, no_me_interesa, usuario_id } = req.body;

  // Verifica si ya existe una preferencia para el usuario
  const queryCheck = `
    SELECT * FROM mentoring WHERE mentor_id = ? AND usuario_id = ?
  `;
  
  db.query(queryCheck, [mentor_id, usuario_id], (err, result) => {
    if (err) {
      console.error('Error al verificar la preferencia:', err);
      return res.status(500).json({ error: 'Error al verificar preferencia' });
    }

    if (result.length > 0) {
      // Si ya existe una preferencia, actualiza los valores
      const updateQuery = `
        UPDATE mentoring
        SET me_interesa = ?, no_me_interesa = ?
        WHERE mentor_id = ? AND usuario_id = ?
      `;
      db.query(updateQuery, [me_interesa, no_me_interesa, mentor_id, usuario_id], (err, result) => {
        if (err) {
          console.error('Error al actualizar preferencia:', err);
          return res.status(500).json({ error: 'Error al actualizar preferencia' });
        }
        res.json({ success: true });
      });
    } else {
      // Si no existe una preferencia, crea una nueva
      const insertQuery = `
        INSERT INTO mentoring (mentor_id, me_interesa, no_me_interesa, usuario_id)
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertQuery, [mentor_id, me_interesa, no_me_interesa, usuario_id], (err, result) => {
        if (err) {
          console.error('Error al insertar preferencia:', err);
          return res.status(500).json({ error: 'Error en la base de datos' });
        }
        res.json({ success: true });
      });
    }
  });
});

// Iniciar el servidor en el puerto 4000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
