"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topicSwagger = {
    swagger: '2.0',
    info: {
        title: 'Knowledge Base API',
        version: '1.0.0',
        description: 'API documentation for managing topics in the Knowledge Base',
    },
    basePath: '/api/topics',
    paths: {
        '/': {
            get: {
                summary: 'Get all topics',
                responses: {
                    200: {
                        description: 'A list of topics',
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/definitions/Topic',
                            },
                        },
                    },
                },
            },
            post: {
                summary: 'Create a new topic',
                parameters: [
                    {
                        in: 'body',
                        name: 'topic',
                        description: 'Topic object to be created',
                        required: true,
                        schema: {
                            $ref: '#/definitions/Topic',
                        },
                    },
                ],
                responses: {
                    201: {
                        description: 'Topic created successfully',
                        schema: {
                            $ref: '#/definitions/Topic',
                        },
                    },
                },
            },
        },
        '/{id}': {
            get: {
                summary: 'Get a topic by ID',
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
                        description: 'Topic details',
                        schema: {
                            $ref: '#/definitions/Topic',
                        },
                    },
                    404: {
                        description: 'Topic not found',
                    },
                },
            },
            put: {
                summary: 'Update a topic',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        type: 'string',
                    },
                    {
                        in: 'body',
                        name: 'topic',
                        description: 'Updated topic object',
                        required: true,
                        schema: {
                            $ref: '#/definitions/Topic',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Topic updated successfully',
                        schema: {
                            $ref: '#/definitions/Topic',
                        },
                    },
                    404: {
                        description: 'Topic not found',
                    },
                },
            },
            delete: {
                summary: 'Delete a topic',
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
                        description: 'Topic deleted successfully',
                    },
                    404: {
                        description: 'Topic not found',
                    },
                },
            },
        },
    },
    definitions: {
        Topic: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
                content: {
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
                version: {
                    type: 'integer',
                },
                parentTopicId: {
                    type: 'string',
                },
            },
        },
    },
};
exports.default = topicSwagger;
