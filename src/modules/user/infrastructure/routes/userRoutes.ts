import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { UserController } from '../controllers/userController';
import { UserValidationMiddleware } from '../middleware/userValidation';
import { AuthMiddleware } from '../../../../shared/infrastructure/middleware/authMiddleware';
import { UserRoleEnum } from '../../../../shared/domain/enum/userRole';

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