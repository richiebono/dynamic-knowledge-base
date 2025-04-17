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
exports.FindShortestPath = void 0;
const inversify_1 = require("inversify");
let FindShortestPath = class FindShortestPath {
    constructor(topicRepository) {
        this.topicRepository = topicRepository;
    }
    async execute(startTopicId, endTopicId) {
        const visited = new Set();
        const path = [];
        const findPath = async (currentId) => {
            if (currentId === endTopicId) {
                path.push(currentId);
                return true;
            }
            visited.add(currentId);
            const currentTopic = await this.topicRepository.findById(currentId);
            if (!currentTopic) {
                return false;
            }
            const subTopics = await this.topicRepository.findSubTopics(currentId);
            for (const subTopic of subTopics) {
                if (!visited.has(subTopic.id)) {
                    const found = await findPath(subTopic.id);
                    if (found) {
                        path.push(currentId);
                        return true;
                    }
                }
            }
            return false;
        };
        await findPath(startTopicId);
        return path.reverse();
    }
};
FindShortestPath = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('ITopicRepository')),
    __metadata("design:paramtypes", [Object])
], FindShortestPath);
exports.FindShortestPath = FindShortestPath;
