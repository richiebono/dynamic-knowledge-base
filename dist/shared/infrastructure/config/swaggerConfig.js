"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("./env");
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
                url: env_1.ENV.SWAGGER_BASE_URL,
            },
        ],
    },
    apis: [
        './src/modules/**/infrastructure/routes/*.ts', // Path to route files
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
