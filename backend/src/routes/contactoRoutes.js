const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.post('/contacto', async (req, res) => {
  const { nombre, email, telefono, tipo_consulta, mensaje } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO contactos (envio_formulario, nombres, correo, telefono, seleccion, mensaje_enviado)
       VALUES (NOW(), ?, ?, ?, ?, ?)`,
      [nombre, email, telefono, tipo_consulta, mensaje]
    );
    connection.release();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
