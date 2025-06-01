const express = require('express');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Crear usuario
router.post('/usuario', async (req, res) => {
  const { email, password, rol } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO usuario (usuario, contrasena, rol) VALUES (?, ?, ?)',
      [email, hashedPassword, rol]
    );
    connection.release();
    res.status(200).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error al insertar en usuario:', err);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

module.exports = router;
