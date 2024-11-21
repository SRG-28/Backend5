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

      // Usuario y contraseña predeterminados
      const mockUser = {
        username: "admin@example.com",
        password: "12345",
      };

      // Validar username y contraseña
      if (username !== mockUser.username || password !== mockUser.password) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid credentials" }),
        };
      }

      // Token fijo
      const token = "abc123";

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
