import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { injectable } from 'inversify';
import { ResourceType } from '@resource/domain/enum/resourceType';

@injectable()
export class ResourceValidationMiddleware {
    private createResourceSchema = Joi.object({
        url: Joi.string().uri().required().messages({
            'string.base': 'URL must be a string',
            'string.uri': 'URL must be a valid URI',
            'any.required': 'URL is required',
        }),
        description: Joi.string().required().messages({
            'string.base': 'Description must be a string',
            'any.required': 'Description is required',
        }),
        type: Joi.string()
            .valid(...Object.values(ResourceType))
            .required()
            .messages({
                'string.base': 'Type must be a string',
                'any.only': 'Invalid resource type',
                'any.required': 'Type is required',
            }),
        topicId: Joi.number().integer().required().messages({
            'number.base': 'Topic ID must be a number',
            'number.integer': 'Topic ID must be an integer',
            'any.required': 'Topic ID is required',
        }),
    });

    private updateResourceSchema = Joi.object({
        url: Joi.string().uri().optional(),
        description: Joi.string().optional(),
        type: Joi.string()
            .valid(...Object.values(ResourceType))
            .optional()
            .messages({
                'string.base': 'Type must be a string',
                'any.only': 'Invalid resource type',
            }),
        topicId: Joi.number().integer().optional().messages({
            'number.base': 'Topic ID must be a number',
            'number.integer': 'Topic ID must be an integer',
        }),
    });

    public validateCreateResource(req: Request, res: Response, next: NextFunction) {
        const { error } = this.createResourceSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map((err) => err.message) });
        }
        next();
    }

    public validateUpdateResource(req: Request, res: Response, next: NextFunction) {
        const { error } = this.updateResourceSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map((err) => err.message) });
        }
        next();
    }
}