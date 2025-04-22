import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { UserRoleEnum } from '@shared/domain/enum/userRole';
import { UserController } from '@user/infrastructure/controllers/userController';
import { UserValidationMiddleware } from '@user/infrastructure/middleware/userValidation';

@injectable()
export class UserRoutes {
    private router: Router;

    constructor(
        @inject(UserController) private userController: UserController,
        @inject(UserValidationMiddleware) private userValidationMiddleware: UserValidationMiddleware
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        const authMiddleware = new AuthMiddleware();

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
        this.router.post(
            '/',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.userValidationMiddleware.validateCreateUser.bind(this.userValidationMiddleware),
            this.userController.createUser.bind(this.userController)
        );

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
        this.router.put(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.userValidationMiddleware.validateUpdateUser.bind(this.userValidationMiddleware),
            this.userController.updateUser.bind(this.userController)
        );

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
        this.router.get(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer),
            this.userController.getUserById.bind(this.userController)
        );

        /**
         * @swagger
         * /users:
         *   get:
         *     summary: Get all users
         *     tags: [Users]
         *     parameters:
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *         description: Number of users to return
         *       - in: query
         *         name: offset
         *         schema:
         *           type: integer
         *         description: Number of users to skip
         *       - in: query
         *         name: orderBy
         *         schema:
         *           type: string
         *         description: Field to order by (e.g., name, email, createdAt)
         *       - in: query
         *         name: orderDirection
         *         schema:
         *           type: string
         *           enum: [ASC, DESC]
         *         description: Order direction (ASC or DESC)
         *     responses:
         *       200:
         *         description: List of users
         */
        this.router.get(
            '/',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.userController.getAllUsers.bind(this.userController)
        );

        this.router.post('/login', this.userController.login.bind(this.userController));
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default UserRoutes;