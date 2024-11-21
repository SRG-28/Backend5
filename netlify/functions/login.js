"use strict";

const headers = require('./headerCORS');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
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
        body: JSON.stringify({ message: "All input is required" })
      };
    }

    // Buscar usuario en el archivo JSON
    const user = await getUserByEmail(data.email);

    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "User not found" })
      };
    }

    // Verificar la contraseña del usuario
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Invalid Credentials" })
      };
    }

    // Generar el token JWT
    const token = jwt.sign(
      { user_id: user.email, role: user.role },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    // Responder con el token
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

// Función para obtener usuario desde el archivo JSON
async function getUserByEmail(email) {
  try {
    const usersData = fs.readFileSync('./users.json', 'utf8');
    const users = JSON.parse(usersData);

    // Buscar el usuario por email
    return users.find(user => user.email === email);
  } catch (error) {
    console.error("Error al leer el archivo de usuarios:", error);
    throw new Error("Error al obtener el usuario.");
  }
}

