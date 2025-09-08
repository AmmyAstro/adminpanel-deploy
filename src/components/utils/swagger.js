import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Next.js API Docs",
      version: "1.0.0",
      description: "Swagger setup in Next.js App Router",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/app/api/**/*.js"], 
};

export const swaggerSpec = swaggerJsdoc(options);
