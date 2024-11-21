const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.handler = async (event) => {
  if (event.httpMethod === "POST") {
    try {
      const { username, password } = JSON.parse(event.body);

      // Verificar que ambos campos estén presentes
      if (!username || !password) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Username and password are required" }),
        };
      }

      // Usuario de ejemplo con contraseña encriptada
      const mockUser = {
        username: "admin@example.com",
        passwordHash: "$2a$10$hA8yhjQhNTJZh/Qnxv9nAeNftqc74nUuvpCPs1R3/njWl5OYjR7Lq", // Hash de "12345"
      };

      // Validar el username
      if (username !== mockUser.username) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid credentials" }),
        };
      }

      // Validar la contraseña
      const passwordMatch = await bcrypt.compare(password, mockUser.passwordHash);
      if (!passwordMatch) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid credentials" }),
        };
      }

      // Generar el token JWT
      const token = jwt.sign(
        { username: mockUser.username },
        "secret-key", // Cambia esta clave por una más segura
        { expiresIn: "1h" }
      );

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
