// backend/server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");  // el driver mysql2 con promesas

console.log("🔄 Iniciando backend (MySQL)...");

const app = express();
app.use(cors());
app.use(express.json());

// 1) Configuración de la conexión MySQL
const pool = mysql.createPool({
  host:     "localhost",        // o la IP donde esté tu MySQL
  port:     3306,               // puerto por defecto de MySQL
  user:     "root", // p.ej. "root" o el que configuraste
  password: "1234",
  database: "INCUVALAB",        // la base que creaste con los CREATE TABLE
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware de logging básico
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 2) Rutas para CRUD de Inspiring
app.get("/api/inspiring", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM inspiring");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error leyendo 'inspiring':", err.message);
    res.status(500).send("Error leyendo Inspiring");
  }
});

// 3) Rutas para CRUD de Challenger
app.get("/api/challenger", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM challenger");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error leyendo 'challenger':", err.message);
    res.status(500).send("Error leyendo Challenger");
  }
});

// 4) Arranque del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`⚡ Backend escuchando en http://localhost:${PORT}`);
});
