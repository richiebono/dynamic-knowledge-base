"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resourceSwagger = {
    swagger: '2.0',
    info: {
        title: 'Resource API',
        description: 'API documentation for managing resources in the knowledge base.',
        version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/api/v1',
    schemes: ['http'],
    paths: {
        '/resources': {
            get: {
                summary: 'Get all resources',
                responses: {
                    200: {
                        description: 'A list of resources',
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/definitions/Resource',
                            },
                        },
                    },
                },
            },
            post: {
                summary: 'Create a new resource',
                parameters: [
                    {
                        in: 'body',
                        name: 'resource',
                        description: 'Resource object to be created',
                        required: true,
                        schema: {
                            $ref: '#/definitions/Resource',
                        },
                    },
                ],
                responses: {
                    201: {
                        description: 'Resource created successfully',
                        schema: {
                            $ref: '#/definitions/Resource',
                        },
                    },
                },
            },
        },
        '/resources/{id}': {
            get: {
                summary: 'Get a resource by ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        type: 'string',
                    },
                ],
                responses: {
                    200: {
                        description: 'Resource details',
                        schema: {
                            $ref: '#/definitions/Resource',
                        },
                    },
                    404: {
                        description: 'Resource not found',
                    },
                },
            },
            put: {
                summary: 'Update a resource',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        type: 'string',
                    },
                    {
                        in: 'body',
                        name: 'resource',
                        description: 'Updated resource object',
                        required: true,
                        schema: {
                            $ref: '#/definitions/Resource',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Resource updated successfully',
                        schema: {
                            $ref: '#/definitions/Resource',
                        },
                    },
                    404: {
                        description: 'Resource not found',
                    },
                },
            },
            delete: {
                summary: 'Delete a resource',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        type: 'string',
                    },
                ],
                responses: {
                    204: {
                        description: 'Resource deleted successfully',
                    },
                    404: {
                        description: 'Resource not found',
                    },
                },
            },
        },
    },
    definitions: {
        Resource: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                },
                topicId: {
                    type: 'string',
                },
                url: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                type: {
                    type: 'string',
                },
                createdAt: {
                    type: 'string',
                    format: 'date-time',
                },
                updatedAt: {
                    type: 'string',
                    format: 'date-time',
                },
            },
        },
    },
};
exports.default = resourceSwagger;
