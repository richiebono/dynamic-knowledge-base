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
exports.UpdateResource = void 0;
const inversify_1 = require("inversify");
const resourceRepository_1 = require("../../domain/interfaces/resourceRepository");
const resource_1 = require("../../domain/entities/resource");
let UpdateResource = class UpdateResource {
    constructor(resourceRepository) {
        this.resourceRepository = resourceRepository;
    }
    async execute(resourceId, resourceData) {
        const existingResource = await this.resourceRepository.findById(resourceId);
        if (!existingResource) {
            throw new Error('Resource not found');
        }
        const updatedResource = new resource_1.Resource({
            id: existingResource.id,
            topicId: existingResource.topicId,
            url: resourceData.url || existingResource.url,
            description: resourceData.description || existingResource.description,
            type: resourceData.type || existingResource.type,
            createdAt: existingResource.createdAt,
            updatedAt: new Date(),
        });
        await this.resourceRepository.update(updatedResource);
        return updatedResource;
    }
};
UpdateResource = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('ResourceRepository')),
    __metadata("design:paramtypes", [typeof (_a = typeof resourceRepository_1.ResourceRepository !== "undefined" && resourceRepository_1.ResourceRepository) === "function" ? _a : Object])
], UpdateResource);
exports.UpdateResource = UpdateResource;
