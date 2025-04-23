import { Router } from 'express';
import { TopicController } from '@topic/infrastructure/controllers/topicController';
import { TopicValidationMiddleware } from '@topic/infrastructure/middleware/topicValidation';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { UserRoleEnum } from '@shared/domain/enum/userRole';
import { inject, injectable } from 'inversify';

@injectable()
export class TopicRoutes {
    private router: Router;

    constructor(
        @inject(TopicController) private topicController: TopicController,
        @inject(TopicValidationMiddleware) private topicValidationMiddleware: TopicValidationMiddleware
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        const authMiddleware = new AuthMiddleware();

        /**
         * @swagger
         * /api/topics:
         *   post:
         *     summary: Create a new topic
         *     tags: [Topics]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - name
         *               - content
         *               - createdBy
         *             properties:
         *               name:
         *                 type: string
         *               content:
         *                 type: string
         *               parentTopicId:
         *                 type: string
         *                 nullable: true
         *     responses:
         *       201:
         *         description: Topic created successfully
         *       400:
         *         description: Invalid input
         */
        this.router.post(
            '/',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.topicValidationMiddleware.validateCreateTopic.bind(this.topicValidationMiddleware),
            this.topicController.createTopic.bind(this.topicController)
        );

        /**
         * @swagger
         * /api/topics/{id}:
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
         *               content:
         *                 type: string
         *               parentTopicId:
         *                 type: string
         *                 nullable: true
         *     responses:
         *       200:
         *         description: Topic updated successfully
         *       400:
         *         description: Invalid input
         *       404:
         *         description: Topic not found
         */
        this.router.put(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.topicValidationMiddleware.validateUpdateTopic.bind(this.topicValidationMiddleware),
            this.topicController.updateTopic.bind(this.topicController)
        );

        /**
         * @swagger
         * /api/topics/{id}:
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
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 id:
         *                   type: string
         *                 name:
         *                   type: string
         *                 content:
         *                   type: string
         *                 createdAt:
         *                   type: string
         *                   format: date-time
         *                 updatedAt:
         *                   type: string
         *                   format: date-time
         *                   nullable: true
         *                 version:
         *                   type: integer
         *                 parentTopicId:
         *                   type: string
         *                   nullable: true
         *                 subTopics:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/TopicDTO'
         *       404:
         *         description: Topic not found
         */
        this.router.get(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer),
            this.topicController.getTopicById.bind(this.topicController)
        );

        /**
         * @swagger
         * /api/topics/tree/{id}:
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
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/TopicDTO'
         *       404:
         *         description: Topic not found
         */
        this.router.get(
            '/tree/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer),
            this.topicController.getTopicTree.bind(this.topicController)
        );

        /**
         * @swagger
         * /api/topics/shortest-path/{startId}/{endId}:
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
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/TopicDTO'
         *       404:
         *         description: Path not found
         */
        this.router.get(
            '/shortest-path/:startId/:endId',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer),
            this.topicController.findShortestPath.bind(this.topicController)
        );

        /**
         * @swagger
         * /api/topics:
         *   get:
         *     summary: Get all topics
         *     tags: [Topics]
         *     parameters:
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *         description: Number of topics to return
         *       - in: query
         *         name: offset
         *         schema:
         *           type: integer
         *         description: Number of topics to skip
         *       - in: query
         *         name: orderBy
         *         schema:
         *           type: string
         *         description: Field to order by (e.g., name, createdAt)
         *       - in: query
         *         name: orderDirection
         *         schema:
         *           type: string
         *           enum: [ASC, DESC]
         *         description: Order direction (ASC or DESC)
         *     responses:
         *       200:
         *         description: List of topics
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 topics:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/TopicDTO'
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
            this.topicController.getAllTopics.bind(this.topicController)
        );

        /**
         * @swagger
         * /api/topics/{id}:
         *   delete:
         *     summary: Delete a topic
         *     tags: [Topics]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       204:
         *         description: Topic deleted successfully
         *       404:
         *         description: Topic not found
         */
        this.router.delete(
            '/:id',
            authMiddleware.checkPermissions(UserRoleEnum.Admin),
            this.topicController.deleteTopic.bind(this.topicController)
        );

        /**
         * @swagger
         * /api/topics/{id}/versions/{version}:
         *   get:
         *     summary: Get a specific version of a topic
         *     tags: [Topics]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: version
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Topic version retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/TopicDTO'
         *       400:
         *         description: Invalid version number
         *       404:
         *         description: Topic or version not found
         */
        this.router.get(
            '/:id/versions/:version',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer),
            this.topicController.getTopicVersion.bind(this.topicController)
        );

        /**
         * @swagger
         * /api/topics/{id}/history:
         *   get:
         *     summary: Get version history of a topic
         *     tags: [Topics]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Topic history retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *                 properties:
         *                   version:
         *                     type: integer
         *                   createdAt:
         *                     type: string
         *                     format: date-time
         *       404:
         *         description: Topic not found
         */
        this.router.get(
            '/:id/history',
            authMiddleware.checkPermissions(UserRoleEnum.Viewer),
            this.topicController.getTopicHistory.bind(this.topicController)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}