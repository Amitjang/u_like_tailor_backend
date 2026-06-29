const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Worker Management API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: "https://u-like-tailor-backend.onrender.com",
        description: "Development server",
      },
    ],
  },
  apis: ["src/routes/*.js",
    "src/docs/worker.swagger.js"],
};

module.exports = swaggerJsdoc(options);