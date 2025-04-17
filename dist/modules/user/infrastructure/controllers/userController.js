"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const inversify_1 = require("inversify");
let UserController = class UserController {
    constructor(userCommandHandler, userQueryHandler) {
        this.userCommandHandler = userCommandHandler;
        this.userQueryHandler = userQueryHandler;
    }
    async createUser(req, res) {
        try {
            const userDTO = req.body;
            await this.userCommandHandler.createUser(userDTO);
            res.status(201).json({ message: 'User created successfully' });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on createUser';
            res.status(500).json({ message: errorMessage });
        }
    }
    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const userDTO = req.body;
            await this.userCommandHandler.updateUser(userId, userDTO);
            res.status(200).json({ message: 'User updated successfully' });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on updateUser';
            res.status(500).json({ message: errorMessage });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await this.userQueryHandler.getAllUsers();
            res.status(200).json(users);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on getAllUsers';
            res.status(500).json({ message: errorMessage });
        }
    }
    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await this.userQueryHandler.getUserById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on getUserById';
            res.status(500).json({ message: errorMessage });
        }
    }
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            await this.userCommandHandler.deleteUser(userId);
            res.status(204).send();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on deleteUser';
            res.status(500).json({ message: errorMessage });
        }
    }
};
UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("IUserCommandHandler")),
    __param(1, (0, inversify_1.inject)("IUserQueryHandler")),
    __metadata("design:paramtypes", [Object, Object])
], UserController);
exports.UserController = UserController;
