"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userSwagger = {
    swagger: '2.0',
    info: {
        title: 'User API',
        version: '1.0.0',
        description: 'API documentation for user management in the knowledge base system.',
    },
    host: 'localhost:3000',
    basePath: '/api/v1/users',
    schemes: ['http'],
    paths: {
        '/': {
            get: {
                summary: 'Get all users',
                description: 'Retrieve a list of all users.',
                responses: {
                    200: {
                        description: 'A list of users',
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/definitions/User',
                            },
                        },
                    },
                },
            },
            post: {
                summary: 'Create a new user',
                description: 'Add a new user to the system.',
                parameters: [
                    {
                        in: 'body',
                        name: 'user',
                        description: 'User object to be created',
                        required: true,
                        schema: {
                            $ref: '#/definitions/User',
                        },
                    },
                ],
                responses: {
                    201: {
                        description: 'User created successfully',
                        schema: {
                            $ref: '#/definitions/User',
                        },
                    },
                },
            },
        },
        '/{id}': {
            get: {
                summary: 'Get a user by ID',
                description: 'Retrieve a user by their unique ID.',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        type: 'string',
                        description: 'ID of the user to retrieve',
                    },
                ],
                responses: {
                    200: {
                        description: 'User details',
                        schema: {
                            $ref: '#/definitions/User',
                        },
                    },
                    404: {
                        description: 'User not found',
                    },
                },
            },
            put: {
                summary: 'Update a user',
                description: 'Update an existing user by their ID.',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        type: 'string',
                        description: 'ID of the user to update',
                    },
                    {
                        in: 'body',
                        name: 'user',
                        description: 'Updated user object',
                        required: true,
                        schema: {
                            $ref: '#/definitions/User',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'User updated successfully',
                        schema: {
                            $ref: '#/definitions/User',
                        },
                    },
                    404: {
                        description: 'User not found',
                    },
                },
            },
            delete: {
                summary: 'Delete a user',
                description: 'Remove a user from the system by their ID.',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        type: 'string',
                        description: 'ID of the user to delete',
                    },
                ],
                responses: {
                    204: {
                        description: 'User deleted successfully',
                    },
                    404: {
                        description: 'User not found',
                    },
                },
            },
        },
    },
    definitions: {
        User: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    example: '1',
                },
                name: {
                    type: 'string',
                    example: 'John Doe',
                },
                email: {
                    type: 'string',
                    example: 'john.doe@example.com',
                },
                role: {
                    type: 'string',
                    enum: ['Admin', 'Editor', 'Viewer'],
                    example: 'Admin',
                },
                createdAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2023-01-01T00:00:00Z',
                },
            },
            required: ['name', 'email', 'role'],
        },
    },
};
exports.default = userSwagger;
