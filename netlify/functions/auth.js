// netlify/functions/auth.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.handler = async (event) => {
  if (event.httpMethod === "POST") {
    try {
      const { username, password } = JSON.parse(event.body);

      if (!username || !password) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Username and password are required" }),
        };
      }

      // Simula la validación del usuario
      const mockUser = { username: "admin@example.com", passwordHash: "$2a$10$e8.d8..." };

      const passwordMatch = await bcrypt.compare(password, mockUser.passwordHash);

      if (!passwordMatch) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid credentials" }),
        };
      }

      const token = jwt.sign({ username: mockUser.username }, "secret-key", { expiresIn: "1h" });

      return {
        statusCode: 200,
        body: JSON.stringify({ token }),
      };
    } catch (error) {
      console.error("Error in login handler:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
