"use strict";

const headers = require('./headerCORS'); // Configuración de los headers para CORS
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
require('dotenv').config();


exports.handler = async (event, context) => {
  // Manejo de preflight para CORS (solicitudes OPTIONS)
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

    // Verificar que el email y la contraseña estén presentes en la solicitud
    if (!(data.email && data.password)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "All input is required" })
      };
    }

    // Buscar el usuario en el archivo JSON
    const user = await getUserByEmail(data.email);

    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "User not found" })
      };
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos (en el archivo JSON)
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: "Invalid Credentials" })
      };
    }

    // Generar el token JWT
    const token = jwt.sign(
      { user_id: user.email, role: user.role },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }  // El token expirará en 2 horas
    );

    // Responder con el token generado
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ token })
    };

  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

// Función para obtener un usuario por email desde el archivo JSON
async function getUserByEmail(email) {
  try {
    const usersData = fs.readFileSync('./users.json', 'utf8'); // Leer el archivo de usuarios
    const users = JSON.parse(usersData); // Parsear el contenido del archivo JSON

    // Retornar el usuario encontrado o null si no se encuentra
    return users.find(user => user.email === email) || null;
  } catch (error) {
    console.error("Error al leer el archivo de usuarios:", error);
    throw new Error("Error al obtener el usuario.");
  }
}
