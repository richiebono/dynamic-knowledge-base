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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicController = void 0;
const inversify_1 = require("inversify");
const topicService_1 = require("../../application/interfaces/topicService");
let TopicController = class TopicController {
    constructor(topicService) {
        this.topicService = topicService;
    }
    async createTopic(req, res) {
        try {
            const topicData = req.body;
            const newTopic = await this.topicService.createTopic(topicData);
            res.status(201).json(newTopic);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async updateTopic(req, res) {
        try {
            const topicId = req.params.id;
            const topicData = req.body;
            const updatedTopic = await this.topicService.updateTopic(topicId, topicData);
            res.status(200).json(updatedTopic);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getTopicTree(req, res) {
        try {
            const topicId = req.params.id;
            const topicTree = await this.topicService.getTopicTree(topicId);
            res.status(200).json(topicTree);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async findShortestPath(req, res) {
        try {
            const { startTopicId, endTopicId } = req.body;
            const path = await this.topicService.findShortestPath(startTopicId, endTopicId);
            res.status(200).json(path);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
TopicController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('TopicService')),
    __metadata("design:paramtypes", [typeof (_a = typeof topicService_1.TopicService !== "undefined" && topicService_1.TopicService) === "function" ? _a : Object])
], TopicController);
exports.TopicController = TopicController;
