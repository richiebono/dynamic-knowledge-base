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
exports.CreateResource = void 0;
const inversify_1 = require("inversify");
const resource_1 = require("../../domain/entities/resource");
let CreateResource = class CreateResource {
    constructor(resourceRepository) {
        this.resourceRepository = resourceRepository;
    }
    async execute(resourceDTO) {
        const resource = new resource_1.Resource({
            id: resourceDTO.id,
            topicId: resourceDTO.topicId,
            url: resourceDTO.url,
            description: resourceDTO.description,
            type: resourceDTO.type,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return await this.resourceRepository.create(resource);
    }
};
CreateResource = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IResourceRepository')),
    __metadata("design:paramtypes", [Object])
], CreateResource);
exports.CreateResource = CreateResource;
