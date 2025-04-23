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
         * /api/users:
         *   post:
         *     summary: Create a new user
         *     tags: [Users]
         *     security: []  # Line added for testing purposes, remove this after create an admin user
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - name
         *               - email
         *               - password
         *               - role
         *             properties:
         *               name:
         *                 type: string
         *               email:
         *                 type: string
         *               password:
         *                 type: string
         *                 format: password
         *               role:
         *                 type: string
         *                 enum: [Admin, Editor, Viewer, Contributor]
         *     responses:
         *       201:
         *         description: User created successfully
         *       400:
         *         description: Invalid input
         */
        this.router.post(
            '/',
            // I Will not validate permission for testing purposes, after create a user we can uncomment next line and remove this comment.
            // authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.userValidationMiddleware.validateCreateUser.bind(this.userValidationMiddleware),
            this.userController.createUser.bind(this.userController)
        );

        /**
         * @swagger
         * /api/users/{id}:
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
         *               password:
         *                 type: string
         *                 format: password
         *               role:
         *                 type: string
         *                 enum: [Admin, Editor, Viewer, Contributor]
         *     responses:
         *       200:
         *         description: User updated successfully
         *       400:
         *         description: Invalid input
         *       404:
         *         description: User not found
         */
        this.router.put(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.userValidationMiddleware.validateUpdateUser.bind(this.userValidationMiddleware),
            this.userController.updateUser.bind(this.userController)
        );

        /**
         * @swagger
         * /api/users/{id}:
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
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 id:
         *                   type: string
         *                 name:
         *                   type: string
         *                 email:
         *                   type: string
         *                 role:
         *                   type: string
         *                   enum: [Admin, Editor, Viewer, Contributor]
         *                 createdAt:
         *                   type: string
         *                   format: date-time
         *       404:
         *         description: User not found
         */
        this.router.get(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer),
            this.userController.getUserById.bind(this.userController)
        );

        /**
         * @swagger
         * /api/users:
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
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 users:
         *                   type: array
         *                   items:
         *                     type: object
         *                     properties:
         *                       id:
         *                         type: string
         *                       name:
         *                         type: string
         *                       email:
         *                         type: string
         *                       role:
         *                         type: string
         *                         enum: [Admin, Editor, Viewer, Contributor]
         *                       createdAt:
         *                         type: string
         *                         format: date-time
         *                 total:
         *                   type: integer
         *                 limit:
         *                   type: integer
         *                 offset:
         *                   type: integer
         */
        this.router.get(
            '/',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.userController.getAllUsers.bind(this.userController)
        );

        /**
         * @swagger
         * /api/users/{id}:
         *   delete:
         *     summary: Delete a user
         *     tags: [Users]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       204:
         *         description: User deleted successfully
         *       404:
         *         description: User not found
         */
        this.router.delete(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.userController.deleteUser.bind(this.userController)
        );

        /**
         * @swagger
         * /api/users/login:
         *   post:
         *     summary: Authenticate user and get token
         *     tags: [Users]
         *     security: []  # Sobrescreve a configuração global de segurança para este endpoint
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - email
         *               - password
         *             properties:
         *               email:
         *                 type: string
         *                 format: email
         *                 description: User email address
         *               password:
         *                 type: string
         *                 format: password
         *                 description: User password
         *     responses:
         *       200:
         *         description: Login successful
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 token:
         *                   type: string
         *                   description: JWT authentication token
         *       401:
         *         description: Unauthorized - Invalid credentials
         *       500:
         *         description: Internal server error
         */
        this.router.post('/login', this.userController.login.bind(this.userController));
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default UserRoutes;