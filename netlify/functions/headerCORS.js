// login.js (Netlify Function)
const handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow all origins, or replace '*' with the specific domain (e.g., 'http://localhost:5173')
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Methods allowed
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allowed headers
    },
    body: JSON.stringify({ message: 'Login successful!' }),
  };
};

exports.handler = handler;
