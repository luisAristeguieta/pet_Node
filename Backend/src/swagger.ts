import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { type Application } from 'express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mascotas API',
      version: '1.0.0',
      description: 'API para gestionar mascotas, incluyendo operaciones CRUD, subida de archivos (Multer) y autenticación JWT.', 
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      }
    ],
    // Habilita el candado de autenticación JWT (bearerAuth)
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu Token JWT para autenticarte'
        }
      }
    },
    // Aplica la seguridad globalmente
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts'] // Archivos donde estarán las anotaciones de Swagger
};

const swaggerEsp = swaggerJSDoc(swaggerOptions); 

export const swaggerDocs = (app: Application, port: number) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerEsp));
  console.log(`Documentación de Swagger disponible en http://localhost:${port}/api-docs`)
};