const cors = require('cors');

const corsOptions = {
  origin: '*', // Cambia '*' por tu dominio en producción, como 'http://localhost:5173' o 'https://mi-frontend.com'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras que permite el cliente
  credentials: true, // Permitir cookies (si aplica)
};

module.exports = cors(corsOptions);
