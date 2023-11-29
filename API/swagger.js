const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // Spécifiez le chemin de vos fichiers de route
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
