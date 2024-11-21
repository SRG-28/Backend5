// authMiddleware.js
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Middleware para verificar JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Asumimos que el token viene como 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado: No se proporcionó token' });
  }

  // En este caso verificamos el token fijo "abc123" sin verificar un secreto
  if (token === "abc123") {
    req.user = { username: "admin@example.com" }; // Simulación de un usuario validado
    next();
  } else {
    return res.status(403).json({ message: 'Token no válido' });
  }
};

module.exports = authenticateJWT;
