"use strict";

const headers = require('./headersCORS');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('dotenv').config();

exports.handler = async (event, context) => {

  // Permitir opciones para CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK"
    };
  }

  try {
    // Parsear el cuerpo de la solicitud
    const data = JSON.parse(event.body);

    // Verificar que el email y password sean proporcionados
    if (!(data.email && data.password)) {
      return {
        statusCode: 400,
        headers,
        body: "All input is required"
      };
    }

    // Simulación de búsqueda de usuario en base de datos
    let user = await getUserByEmail(data.email); // Función para obtener usuario real (deberías implementarla)

    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: 'User not found'
      };
    }

    // Verificar la contraseña del usuario
    const isPasswordValid = await bcrypt.compare(data.password, user.password); // Aquí se compara el hash de la contraseña almacenada

    if (!isPasswordValid) {
      return {
        statusCode: 400,
        headers,
        body: 'Invalid Credentials'
      };
    }

    // Generar el token JWT
    const token = jwt.sign(
      { user_id: user._id, email: data.email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    // Responder con el token
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ token }) // Solo retornamos el token
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: 422,
      headers,
      body: JSON.stringify(error)
    };
  }
};

// Función para simular la obtención de un usuario desde una base de datos
// Debes reemplazar esto con tu lógica real de base de datos
async function getUserByEmail(email) {
  // Simulando que el email es único y está registrado en la base de datos
  // El password en la base de datos debe ser un hash previamente generado
  const dummyUsers = [
    { _id: 1, email: 'user@example.com', password: await bcrypt.hash('12345', 10) },
    // Aquí puedes agregar más usuarios simulados si es necesario
  ];

  return dummyUsers.find(user => user.email === email);
}
