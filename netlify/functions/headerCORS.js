const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:5173',  // Permite solo tu frontend en localhost
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Si necesitas enviar cookies o credenciales
};

app.use(cors(corsOptions));  // Aplica CORS con las opciones configuradas
