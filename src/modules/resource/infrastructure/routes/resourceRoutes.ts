import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { ResourceController } from '@resource/infrastructure/controllers/resourceController';
import { ResourceValidationMiddleware } from '@resource/infrastructure/middleware/resourceValidation';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

@injectable()
export class ResourceRoutes {
    private router: Router;

    constructor(
        @inject(ResourceController) private resourceController: ResourceController,
        @inject(ResourceValidationMiddleware) private resourceValidationMiddleware: ResourceValidationMiddleware
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        const authMiddleware = new AuthMiddleware();

        /**
         * @swagger
         * /resources:
         *   post:
         *     summary: Create a new resource
         *     tags: [Resources]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - topicId
         *               - url
         *               - description
         *               - type
         *             properties:
         *               topicId:
         *                 type: string
         *               url:
         *                 type: string
         *               description:
         *                 type: string
         *               type:
         *                 type: string
         *     responses:
         *       201:
         *         description: Resource created successfully
         *       400:
         *         description: Invalid input
         */
        this.router.post(
            '/',
            authMiddleware.checkPermissions(UserRoleEnum.Admin), 
            this.resourceValidationMiddleware.validateCreateResource.bind(this.resourceValidationMiddleware),
            this.resourceController.createResource.bind(this.resourceController)
        );

        /**
         * @swagger
         * /resources/{id}:
         *   put:
         *     summary: Update an existing resource
         *     tags: [Resources]
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
         *               url:
         *                 type: string
         *               description:
         *                 type: string
         *               type:
         *                 type: string
         *     responses:
         *       200:
         *         description: Resource updated successfully
         *       400:
         *         description: Invalid input
         *       404:
         *         description: Resource not found
         */
        this.router.put(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.resourceValidationMiddleware.validateUpdateResource.bind(this.resourceValidationMiddleware),
            this.resourceController.updateResource.bind(this.resourceController)
        );

        /**
         * @swagger
         * /resources/{id}:
         *   get:
         *     summary: Get a resource by ID
         *     tags: [Resources]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Resource retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 id:
         *                   type: string
         *                 topicId:
         *                   type: string
         *                 url:
         *                   type: string
         *                 description:
         *                   type: string
         *                 type:
         *                   type: string
         *                 createdAt:
         *                   type: string
         *                   format: date-time
         *                 updatedAt:
         *                   type: string
         *                   format: date-time
         *                   nullable: true
         *       404:
         *         description: Resource not found
         */
        this.router.get(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer),
            this.resourceController.getResource.bind(this.resourceController)
        );

        /**
         * @swagger
         * /resources/topic/{topicId}:
         *   get:
         *     summary: Get all resources for a specific topic
         *     tags: [Resources]
         *     parameters:
         *       - in: path
         *         name: topicId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of resources for the topic
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: string
         *                   topicId:
         *                     type: string
         *                   url:
         *                     type: string
         *                   description:
         *                     type: string
         *                   type:
         *                     type: string
         *                   createdAt:
         *                     type: string
         *                     format: date-time
         *                   updatedAt:
         *                     type: string
         *                     format: date-time
         *                     nullable: true
         */
        this.router.get(
            '/topic/:topicId',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer), 
            this.resourceController.getResourcesByTopicId.bind(this.resourceController)
        );

        /**
         * @swagger
         * /resources:
         *   get:
         *     summary: Get all resources
         *     tags: [Resources]
         *     parameters:
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *         description: Number of resources to return
         *       - in: query
         *         name: offset
         *         schema:
         *           type: integer
         *         description: Number of resources to skip
         *       - in: query
         *         name: orderBy
         *         schema:
         *           type: string
         *         description: Field to order by (e.g., url, createdAt)
         *       - in: query
         *         name: orderDirection
         *         schema:
         *           type: string
         *           enum: [ASC, DESC]
         *         description: Order direction (ASC or DESC)
         *     responses:
         *       200:
         *         description: List of resources
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 resources:
         *                   type: array
         *                   items:
         *                     type: object
         *                     properties:
         *                       id:
         *                         type: string
         *                       topicId:
         *                         type: string
         *                       url:
         *                         type: string
         *                       description:
         *                         type: string
         *                       type:
         *                         type: string
         *                       createdAt:
         *                         type: string
         *                         format: date-time
         *                       updatedAt:
         *                         type: string
         *                         format: date-time
         *                         nullable: true
         *                 total:
         *                   type: integer
         *                 limit:
         *                   type: integer
         *                 offset:
         *                   type: integer
         */
        this.router.get(
            '/',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer),
            this.resourceController.getAllResources.bind(this.resourceController)
        );

        /**
         * @swagger
         * /resources/{id}:
         *   delete:
         *     summary: Delete a resource by ID
         *     tags: [Resources]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Resource deleted successfully
         *       404:
         *         description: Resource not found
         */
        this.router.delete(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.resourceController.deleteResource.bind(this.resourceController)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}