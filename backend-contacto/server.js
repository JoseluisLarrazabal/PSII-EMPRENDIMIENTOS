const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;  // El puerto en el que escuchará tu backend

// Configuración de la conexión con MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Tu usuario de la base de datos
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
app.use(bodyParser.json());

// Ruta para manejar el formulario de contacto
// Ruta para manejar el formulario de contacto
app.post('/api/contacto', (req, res) => {
  const { nombres, correo, telefono, seleccion, mensaje } = req.body;

  console.log('Datos recibidos:', req.body); // Log de los datos recibidos

  const query = `
    INSERT INTO contactos (envio_formulario, nombres, correo, telefono, seleccion, mensaje_enviado, administrador_id)
    VALUES (NOW(), ?, ?, ?, ?, ?, 1)
  `;

  db.execute(query, [nombres, correo, telefono, seleccion, mensaje], (err, results) => {
    if (err) {
      console.error('Error al guardar contacto:', err);
      return res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
    }
    res.json({ success: true, message: '¡Formulario enviado correctamente!' });
  });
});

  

// Iniciar el servidor en el puerto 5000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
