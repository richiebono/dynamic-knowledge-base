import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { ResourceController } from '../controllers/resourceController';
import { ResourceValidationMiddleware } from '../middleware/resourceValidation';

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
         *             properties:
         *               name:
         *                 type: string
         *               topicId:
         *                 type: string
         *     responses:
         *       201:
         *         description: Resource created successfully
         */
        this.router.post(
            '/',
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
         *               name:
         *                 type: string
         *               topicId:
         *                 type: string
         *     responses:
         *       200:
         *         description: Resource updated successfully
         */
        this.router.put(
            '/:id',
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
         */
        this.router.get('/:id', this.resourceController.getResource.bind(this.resourceController));

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
         */
        this.router.get('/topic/:topicId', this.resourceController.getResourcesByTopicId.bind(this.resourceController));

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
         */
        this.router.delete('/:id', this.resourceController.deleteResource.bind(this.resourceController));
    }

    public getRouter(): Router {
        return this.router;
    }
}