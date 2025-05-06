const express = require('express');
const router = express.Router();
const conn = require('../db');
 

router.get('/', (req, res) => {
  conn.query('SELECT * FROM eventos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
 

router.post('/', (req, res) => {
  const { titulo, descripcion, fecha_evento, hora, lugar, administrador_id } = req.body;
  const query = 'INSERT INTO eventos (titulo, descripcion, fecha_evento, hora, lugar, administrador_id) VALUES (?, ?, ?, ?, ?, ?)';
  conn.query(query, [titulo, descripcion, fecha_evento, hora, lugar, administrador_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, ...req.body });
  });
});
 
// PUT actualizar evento
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha_evento, hora, lugar } = req.body;
  
  console.log("Datos recibidos para actualizar: ", req.body);
  console.log("id a actualizar:", id);
  const query = `
    UPDATE eventos SET titulo = ?, descripcion = ?, fecha_evento = ?, hora = ?, lugar = ?
    WHERE id = ?
  `;
  conn.query(query, [titulo, descripcion, fecha_evento, hora, lugar, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ msg: 'Evento actualizado', result });
  });
});

// Eliminar evento
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM eventos WHERE id = ?';
  conn.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ msg: 'Evento eliminado', result });
  });
});

module.exports = router;
 