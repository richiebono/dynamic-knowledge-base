import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { injectable } from 'inversify';

@injectable()
export class TopicValidationMiddleware {
    private createTopicSchema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required and must be a string.',
        }),
        content: Joi.string().required().messages({
            'string.empty': 'Content is required and must be a string.',
        }),
        parentTopicId: Joi.number().integer().optional().messages({
            'number.base': 'Parent Topic ID must be an integer.',
        }),
    });

    private updateTopicSchema = Joi.object({
        name: Joi.string().optional(),
        content: Joi.string().optional(),
        parentTopicId: Joi.number().integer().optional().messages({
            'number.base': 'Parent Topic ID must be an integer.',
        }),
    });

    public validateCreateTopic(req: Request, res: Response, next: NextFunction) {
        const { error } = this.createTopicSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map((err) => err.message) });
        }
        next();
    }

    public validateUpdateTopic(req: Request, res: Response, next: NextFunction) {
        const { error } = this.updateTopicSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map((err) => err.message) });
        }
        next();
    }
}