const express = require('express');
const moocController = require('../controllers/moocController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/categories', moocController.getCategories);
router.get('/courses/:category', moocController.getCoursesByCategory);
router.get('/subjects', moocController.getSubjects);
router.get('/schools', moocController.getSchools);
router.get('/all-courses', moocController.getAllCourses);
router.get('/courses/:id', moocController.getCourseById); // Cambiar de /courses/detail/:id a /courses/:id
router.get('/courses/:id/content', moocController.getCourseContent);

// Rutas protegidas (requieren autenticación)
router.post('/courses', authMiddleware, moocController.createCourse);
router.put('/courses/:id', authMiddleware, moocController.updateCourse);
router.post('/courses/:id/enroll', authMiddleware, moocController.enrollUserInCourse);

module.exports = router;