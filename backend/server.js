// backend/server.js
const express = require("express");
const cors = require("cors");
const sql = require("mssql");

console.log("🔄 Iniciando backend con SQL Auth…");

const app = express();
app.use(cors());
app.use(express.json());

// Configuración con SQL Authentication
const config = {
  user: "sa",               // el login que creaste
  password: "dvlss1lvlss",    // su contraseña
  server: "DESKTOP-GKLF2LB",      // tu máquina o IP
  database: "INCUVALAB",          // tu base de datos
  options: {
    trustServerCertificate: true  // evita errores de certificado
    // si necesitas conectarte a una instancia nombrada:
    // instanceName: "SQLEXPRESS"
  },
  // si tu SQL está en un puerto distinto:
  // port: 1433
};

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/api/inspiring", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM inspiring");
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error leyendo 'inspiring':", err.message);
    res.status(500).send("Error leyendo Inspiring");
  }
});

app.get("/api/challenger", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM challenger");
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error leyendo 'challenger':", err.message);
    res.status(500).send("Error leyendo Challenger");
  }
});

sql.connect(config)
  .then(() => {
    console.log("✅ Conectado a SQL Server con SQL Auth");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`⚡ Backend escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ No se pudo conectar a SQL Server:", err.message);
  });
