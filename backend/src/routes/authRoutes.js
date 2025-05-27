const express = require('express');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM usuario WHERE usuario = ?', [email]);
    connection.release();

    if (rows.length === 0) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.contrasena);

    if (!isMatch) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user.id, email: user.usuario, rol: user.rol }, 'tu_clave_secreta_fuerte_para_desarrollo_123', {
      expiresIn: '100y'
    });

    res.json({ user: { id: user.id, email: user.usuario, rol: user.rol }, token });
  } catch (err) {
    res.status(500).json({ message: 'Error en login' });
  }
});

router.get('/verify-auth', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.json({ isAuthenticated: false });

  try {
    jwt.verify(token, 'tu_clave_secreta_fuerte_para_desarrollo_123');
    res.json({ isAuthenticated: true });
  } catch {
    res.json({ isAuthenticated: false });
  }
});

module.exports = router;
