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
exports.UserRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const userController_1 = require("../controllers/userController");
const userValidation_1 = require("../middleware/userValidation");
let UserRoutes = class UserRoutes {
    constructor(userController, userValidationMiddleware) {
        this.userController = userController;
        this.userValidationMiddleware = userValidationMiddleware;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        /**
         * @swagger
         * /users:
         *   post:
         *     summary: Create a new user
         *     tags: [Users]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               email:
         *                 type: string
         *     responses:
         *       201:
         *         description: User created successfully
         */
        this.router.post('/', this.userValidationMiddleware.validateCreateUser.bind(this.userValidationMiddleware), this.userController.createUser.bind(this.userController));
        /**
         * @swagger
         * /users/{id}:
         *   put:
         *     summary: Update an existing user
         *     tags: [Users]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               email:
         *                 type: string
         *     responses:
         *       200:
         *         description: User updated successfully
         */
        this.router.put('/:id', this.userValidationMiddleware.validateUpdateUser.bind(this.userValidationMiddleware), this.userController.updateUser.bind(this.userController));
        /**
         * @swagger
         * /users/{id}:
         *   get:
         *     summary: Get a user by ID
         *     tags: [Users]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: User retrieved successfully
         */
        this.router.get('/:id', this.userController.getUserById.bind(this.userController));
        /**
         * @swagger
         * /users:
         *   get:
         *     summary: Get all users
         *     tags: [Users]
         *     responses:
         *       200:
         *         description: List of users
         */
        this.router.get('/', this.userController.getAllUsers.bind(this.userController));
    }
    getRouter() {
        return this.router;
    }
};
UserRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(userController_1.UserController)),
    __param(1, (0, inversify_1.inject)(userValidation_1.UserValidationMiddleware)),
    __metadata("design:paramtypes", [userController_1.UserController,
        userValidation_1.UserValidationMiddleware])
], UserRoutes);
exports.UserRoutes = UserRoutes;
exports.default = UserRoutes;
