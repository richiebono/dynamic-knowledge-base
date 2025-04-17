"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicRoutes = void 0;
const express_1 = require("express");
const topicValidation_1 = require("../middleware/topicValidation");
class TopicRoutes {
    constructor(topicController) {
        this.topicController = topicController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Route to create a new topic
        this.router.post('/', topicValidation_1.validateTopic, this.topicController.createTopic.bind(this.topicController));
        // Route to update an existing topic
        this.router.put('/:id', topicValidation_1.validateTopic, this.topicController.updateTopic.bind(this.topicController));
        // Route to get a specific topic by ID
        this.router.get('/:id', this.topicController.getTopicById.bind(this.topicController));
        // Route to get the topic tree
        this.router.get('/tree/:id', this.topicController.getTopicTree.bind(this.topicController));
        // Route to find the shortest path between two topics
        this.router.get('/shortest-path/:startId/:endId', this.topicController.findShortestPath.bind(this.topicController));
    }
    getRouter() {
        return this.router;
    }
}
exports.TopicRoutes = TopicRoutes;
