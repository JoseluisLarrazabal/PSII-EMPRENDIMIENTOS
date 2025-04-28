const express = require('express');
const moocController = require('../controllers/moocController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/categories', moocController.getCategories);
router.get('/courses/:category', moocController.getCoursesByCategory);
router.get('/subjects', moocController.getSubjects);
router.get('/schools', moocController.getSchools);

// Rutas protegidas (requieren autenticación)
router.post('/courses', authMiddleware, moocController.createCourse);
router.put('/courses/:id', authMiddleware, moocController.updateCourse);
router.delete('/courses/:id', authMiddleware, moocController.deleteCourse);

module.exports = router;