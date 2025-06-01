const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const eventosRoutes = require('./routes/eventosRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const challengerRoutes = require('./routes/challengerRoutes');
const inspiringRoutes = require('./routes/inspiringRoutes');
const serviciosRoutes = require('./routes/empresas_serviciosRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const proyectoRoutes = require('./routes/partnersRoutes');
const revenueRoutes = require('./routes/revenueRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rutas
app.use('/api', routes);
app.use('/api', eventosRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', mentorRoutes);
app.use('/api', challengerRoutes);
app.use('/api', inspiringRoutes);
app.use('/api', serviciosRoutes);
app.use('/api', contactoRoutes);
app.use('/api', proyectoRoutes);
app.use('/api', revenueRoutes);
app.use('/api', authRoutes);

// Manejo de errores
app.use(errorHandler);

module.exports = app;
