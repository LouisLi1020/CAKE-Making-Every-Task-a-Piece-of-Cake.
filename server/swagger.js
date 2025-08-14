const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'C.A.K.E. API',
      version: '1.0.0',
      description: 'API documentation for C.A.K.E. project management system',
      contact: {
        name: 'C.A.K.E. Team',
        email: 'support@cake.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['manager', 'leader', 'member'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Client: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            contact: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                phone: { type: 'string' },
                address: { type: 'string' }
              }
            },
            tier: { type: 'string', enum: ['basic', 'premium', 'enterprise'] },
            notes: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            clientId: { $ref: '#/components/schemas/Client' },
            assigneeIds: { type: 'array', items: { $ref: '#/components/schemas/User' } },
            createdBy: { $ref: '#/components/schemas/User' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed', 'cancelled'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
            estimateHours: { type: 'number' },
            actualHours: { type: 'number' },
            revenue: { type: 'number' },
            startedAt: { type: 'string', format: 'date-time' },
            completedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './index.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
