const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso no autorizado. Token no proporcionado.' 
      });
    }
  
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token no válido.' 
      });
    }
  
    try {
      // Cambia 'TU_SECRETO' por tu clave secreta real
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TU_SECRETO');
      req.user = decoded; // Ahora tienes req.user.id disponible
      next();
    } catch (err) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido o expirado.' 
      });
    }
  };
  
  module.exports = authMiddleware;
