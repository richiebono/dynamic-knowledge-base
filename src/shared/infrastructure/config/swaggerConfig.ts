import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { ENV } from '@shared/infrastructure/config/env';
import { Application } from 'express';
import { join } from 'path';

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
                url: ENV.SWAGGER_BASE_URL || 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Insira o token no formato: Bearer <ID_TOKEN>"
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: [
        // Procurar documentação apenas nos arquivos de rotas
        join(__dirname, '../../../modules/**/infrastructure/routes/*.js'),
        join(__dirname, '../../../modules/**/infrastructure/routes/*.ts'),
    ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Application) => {
    // JSON endpoint
    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    // UI endpoint
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        swaggerOptions: {
            displayRequestDuration: true,
            filter: true,
            showCommonExtensions: true
        }
    }));
};
