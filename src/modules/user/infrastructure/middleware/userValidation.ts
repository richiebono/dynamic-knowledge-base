import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { injectable } from 'inversify';

@injectable()
export class UserValidationMiddleware {
    private createUserSchema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Valid email is required',
            'string.empty': 'Email is required',
            'any.required': 'Email is required',
        }),
        password: Joi.string().required().min(6).messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
        }),
        role: Joi.string()
            .valid('Admin', 'Editor', 'Viewer', 'Contributor')
            .required()
            .messages({
                'any.only': 'Role must be Admin, Editor, Viewer, or Contributor',
                'string.empty': 'Role is required',
                'any.required': 'Role is required',
            }),
    });

    private updateUserSchema = Joi.object({
        name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        password: Joi.string().optional().min(6).messages({
            'string.min': 'Password must be at least 6 characters',
        }),
        role: Joi.string()
            .valid('Admin', 'Editor', 'Viewer', 'Contributor')
            .optional()
            .messages({
                'any.only': 'Role must be Admin, Editor, Viewer, or Contributor',
            }),
    });

    public validateCreateUser(req: Request, res: Response, next: NextFunction) {
        const { error } = this.createUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map((err) => err.message) });
        }
        next();
    }

    public validateUpdateUser(req: Request, res: Response, next: NextFunction) {
        const { error } = this.updateUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map((err) => err.message) });
        }
        next();
    }
}