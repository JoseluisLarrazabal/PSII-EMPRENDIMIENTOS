const express = require('express');
const cors = require('cors');
const eventosRoutes = require('./routes/eventos');
require('dotenv').config();
 
const app = express(); // ESTA LÍNEA DEBE ESTAR ANTES DE TODO USO DE `app`
 
// Middleware para debug de rutas
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
 
app.use(cors());
app.use(express.json());
 
app.use('/api/eventos', eventosRoutes);
 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});