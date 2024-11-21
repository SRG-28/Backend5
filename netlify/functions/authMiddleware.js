const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
  // Obtenemos el token de las cabeceras
  const token = req.headers['authorization']?.split(' ')[1]; // Asumimos que el token viene como 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado: No se proporcionó token' });
  }

  // Verificamos el token
  jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido' });
    }
    req.user = user; // Almacenamos los datos del usuario decodificados
    next();
  });
};

module.exports = authenticateJWT;
