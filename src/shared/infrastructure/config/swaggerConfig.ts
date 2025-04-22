import swaggerJsdoc from 'swagger-jsdoc';
import { ENV } from '@shared/infrastructure/config/env';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Knowledge Base API',
            version: '1.0.0',
            description: 'API documentation for the Knowledge Base application',
        },
        servers: [
            {
                url: ENV.SWAGGER_BASE_URL,
            },
        ],
    },
    apis: [
        './src/modules/**/infrastructure/routes/*.ts', 
    ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
