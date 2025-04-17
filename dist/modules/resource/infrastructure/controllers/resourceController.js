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
exports.ResourceController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("shared/infrastructure/inversify/types");
let ResourceController = class ResourceController {
    constructor(resourceService) {
        this.resourceService = resourceService;
    }
    async createResource(req, res) {
        try {
            const resourceData = req.body;
            const newResource = await this.resourceService.createResource(resourceData);
            res.status(201).json(newResource);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on create';
            res.status(500).json({ message: errorMessage });
        }
    }
    async updateResource(req, res) {
        try {
            const resourceId = req.params.id;
            const resourceData = req.body;
            const updatedResource = await this.resourceService.updateResource(resourceId, resourceData);
            res.status(200).json(updatedResource);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on update';
            res.status(500).json({ message: errorMessage });
        }
    }
    async getResource(req, res) {
        try {
            const resourceId = req.params.id;
            const resource = await this.resourceService.getResource(resourceId);
            res.status(200).json(resource);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on get';
            res.status(500).json({ message: errorMessage });
        }
    }
    async deleteResource(req, res) {
        try {
            const resourceId = req.params.id;
            await this.resourceService.deleteResource(resourceId);
            res.status(204).send();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on delete';
            res.status(500).json({ message: errorMessage });
        }
    }
};
ResourceController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ResourceService)),
    __metadata("design:paramtypes", [Object])
], ResourceController);
exports.ResourceController = ResourceController;
