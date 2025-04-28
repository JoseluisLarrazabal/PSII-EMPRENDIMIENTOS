const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', routes);

// Manejo de errores
app.use(errorHandler);

module.exports = app;
