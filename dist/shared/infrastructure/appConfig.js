"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const errorHandler_1 = require("../middleware/errorHandler");
const topicRoutes_1 = require("../../modules/topic/infrastructure/routes/topicRoutes");
const resourceRoutes_1 = require("../../modules/resource/infrastructure/routes/resourceRoutes");
const userRoutes_1 = require("../../modules/user/infrastructure/routes/userRoutes");
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(authMiddleware_1.authMiddleware);
    app.use('/api/topics', topicRoutes_1.topicRoutes);
    app.use('/api/resources', resourceRoutes_1.resourceRoutes);
    app.use('/api/users', userRoutes_1.userRoutes);
    app.use(errorHandler_1.errorHandler);
    return app;
}
exports.createApp = createApp;
