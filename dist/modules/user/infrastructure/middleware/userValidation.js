"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidationMiddleware = void 0;
const joi_1 = __importDefault(require("joi"));
const inversify_1 = require("inversify");
let UserValidationMiddleware = class UserValidationMiddleware {
    constructor() {
        this.createUserSchema = joi_1.default.object({
            name: joi_1.default.string().required().messages({
                'string.empty': 'Name is required',
            }),
            email: joi_1.default.string().email().required().messages({
                'string.email': 'Valid email is required',
                'string.empty': 'Email is required',
            }),
            role: joi_1.default.string()
                .valid('Admin', 'Editor', 'Viewer')
                .required()
                .messages({
                'any.only': 'Role must be Admin, Editor, or Viewer',
                'string.empty': 'Role is required',
            }),
        });
        this.updateUserSchema = joi_1.default.object({
            name: joi_1.default.string().optional(),
            email: joi_1.default.string().email().optional(),
            role: joi_1.default.string()
                .valid('Admin', 'Editor', 'Viewer')
                .optional()
                .messages({
                'any.only': 'Role must be Admin, Editor, or Viewer',
            }),
        });
    }
    validateCreateUser(req, res, next) {
        const { error } = this.createUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map((err) => err.message) });
        }
        next();
    }
    validateUpdateUser(req, res, next) {
        const { error } = this.updateUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map((err) => err.message) });
        }
        next();
    }
};
UserValidationMiddleware = __decorate([
    (0, inversify_1.injectable)()
], UserValidationMiddleware);
exports.UserValidationMiddleware = UserValidationMiddleware;
