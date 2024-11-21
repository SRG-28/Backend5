"use strict"

const headers = require('./headerCORS');
const jwt = require("jsonwebtoken");
require('dotenv').config();
// Middleware aplicado globalmente
app.use(authMiddleware); // Esto podría estar afectando `/auth/login`

// Excluir rutas específicas
app.use("/auth/login", require("./routes/login")); // Sin `authMiddleware`

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return {statusCode: 200,headers,body: "OK"};
  }

  try {

    const data = JSON.parse(event.body);

   if (!data.token) {
      return { statusCode: 400, headers, body: 
         'A token is required for authentication' };
    }
    try {
      const decoded = jwt.verify(data.token, process.env.TOKEN_KEY);
    } catch (err) {
      return { statusCode: 400, headers, body: 'Invalid Token' };
    }
    return { statusCode: 200, headers, body: 'Successful authorization'};
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify(error) };
  }
};