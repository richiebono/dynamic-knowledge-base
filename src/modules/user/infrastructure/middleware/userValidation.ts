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
        role: Joi.string()
            .valid('Admin', 'Editor', 'Viewer')
            .required()
            .messages({
                'any.only': 'Role must be Admin, Editor, or Viewer',
                'string.empty': 'Role is required',
                'any.required': 'Role is required',
            }),
    });

    private updateUserSchema = Joi.object({
        name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        role: Joi.string()
            .valid('Admin', 'Editor', 'Viewer')
            .optional()
            .messages({
                'any.only': 'Role must be Admin, Editor, or Viewer',
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