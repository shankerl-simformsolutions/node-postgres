const swaggerJSDoc = require('swagger-jsdoc');
require("dotenv").config();
const port = process.env.API_PORT;
const swaggerDefinition = {
  openapi: '3.0.0', // OpenAPI version
  info: {
    title: 'Node.js API Documentation', // Title of your API
    version: '1.0.0', // Version of your API
    description: 'API documentation for my Node.js application', // Description
  },
  servers: [
    {
      url: 'http://localhost:'+port, // Base URL of your API
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./route/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
