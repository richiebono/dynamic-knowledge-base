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
exports.ResourceRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const resourceController_1 = require("../controllers/resourceController");
const resourceValidation_1 = require("../middleware/resourceValidation");
let ResourceRoutes = class ResourceRoutes {
    constructor(resourceController) {
        this.resourceController = resourceController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Create a new resource
        this.router.post('/', resourceValidation_1.resourceValidation, this.resourceController.createResource.bind(this.resourceController));
        // Update an existing resource
        this.router.put('/:id', resourceValidation_1.resourceValidation, this.resourceController.updateResource.bind(this.resourceController));
        // Get a resource by ID
        this.router.get('/:id', this.resourceController.getResource.bind(this.resourceController));
        // Get all resources for a specific topic
        this.router.get('/topic/:topicId', this.resourceController.getResourcesByTopicId.bind(this.resourceController));
        // Delete a resource by ID
        this.router.delete('/:id', this.resourceController.deleteResource.bind(this.resourceController));
    }
    getRouter() {
        return this.router;
    }
};
ResourceRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(resourceController_1.ResourceController)),
    __metadata("design:paramtypes", [resourceController_1.ResourceController])
], ResourceRoutes);
exports.ResourceRoutes = ResourceRoutes;
