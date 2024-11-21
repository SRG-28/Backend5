const jwt = require("jsonwebtoken");
require('dotenv').config();
// Middleware aplicado globalmente
app.use(authMiddleware); // Esto podría estar afectando `/auth/login`

// Excluir rutas específicas
app.use("/auth/login", require("./login")); // Sin `authMiddleware`

const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Asumimos que el token viene como 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado: No se proporcionó token' });
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido' });
    }
    req.user = user; // Almacenamos los datos del usuario decodificados
    next();
  });
};

module.exports = authenticateJWT;

