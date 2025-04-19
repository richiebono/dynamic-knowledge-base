import { Router } from 'express';
import { TopicController } from '../controllers/topicController';
import { TopicValidationMiddleware } from '../middleware/topicValidation';
import { AuthMiddleware } from '../../../../shared/infrastructure/middleware/authMiddleware';
import { UserRoleEnum } from '../../../../shared/domain/enum/userRole';


export class TopicRoutes {
    private router: Router;

    constructor(
        private topicController: TopicController,
        private topicValidationMiddleware: TopicValidationMiddleware
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        const authMiddleware = new AuthMiddleware();

        /**
         * @swagger
         * /topics:
         *   post:
         *     summary: Create a new topic
         *     tags: [Topics]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               description:
         *                 type: string
         *     responses:
         *       201:
         *         description: Topic created successfully
         */
        this.router.post(
            '/',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.topicValidationMiddleware.validateCreateTopic.bind(this.topicValidationMiddleware),
            this.topicController.createTopic.bind(this.topicController)
        );

        /**
         * @swagger
         * /topics/{id}:
         *   put:
         *     summary: Update an existing topic
         *     tags: [Topics]
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
         *               description:
         *                 type: string
         *     responses:
         *       200:
         *         description: Topic updated successfully
         */
        this.router.put(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.topicValidationMiddleware.validateUpdateTopic.bind(this.topicValidationMiddleware),
            this.topicController.updateTopic.bind(this.topicController)
        );

        /**
         * @swagger
         * /topics/{id}:
         *   get:
         *     summary: Get a topic by ID
         *     tags: [Topics]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Topic retrieved successfully
         */
        this.router.get(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer), // Usuários autenticados podem acessar detalhes de tópicos
            this.topicController.getTopicById.bind(this.topicController)
        );

        /**
         * @swagger
         * /topics/tree/{id}:
         *   get:
         *     summary: Get the topic tree
         *     tags: [Topics]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Topic tree retrieved successfully
         */
        this.router.get(
            '/tree/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer),
            this.topicController.getTopicTree.bind(this.topicController)
        );

        /**
         * @swagger
         * /topics/shortest-path/{startId}/{endId}:
         *   get:
         *     summary: Find the shortest path between two topics
         *     tags: [Topics]
         *     parameters:
         *       - in: path
         *         name: startId
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: endId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Shortest path retrieved successfully
         */
        this.router.get(
            '/shortest-path/:startId/:endId',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer),
            this.topicController.findShortestPath.bind(this.topicController)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}