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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
require("reflect-metadata"); // Required for inversify
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const inversify_1 = require("inversify");
const dbConnection_1 = require("./shared/infrastructure/database/dbConnection");
const authMiddleware_1 = require("./shared/infrastructure/middleware/authMiddleware");
const errorHandler_1 = require("./shared/infrastructure/middleware/errorHandler");
// import { TopicRoutes } from './modules/topic/infrastructure/routes/topicRoutes';
// import { ResourceRoutes } from './modules/resource/infrastructure/routes/resourceRoutes';
const userRoutes_1 = require("./modules/user/infrastructure/routes/userRoutes");
const swaggerConfig_1 = require("./shared/infrastructure/config/swaggerConfig");
const migrationRunner_1 = require("./shared/infrastructure/database/migrationRunner");
const env_1 = require("./shared/infrastructure/config/env");
let App = class App {
    constructor(dbConnection, authMiddleware, 
    // @inject(TopicRoutes) private topicRoutes: TopicRoutes,
    // @inject(ResourceRoutes) private resourceRoutes: ResourceRoutes,
    userRoutes, errorHandler, migrationRunner) {
        this.dbConnection = dbConnection;
        this.authMiddleware = authMiddleware;
        this.userRoutes = userRoutes;
        this.errorHandler = errorHandler;
        this.migrationRunner = migrationRunner;
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(this.authMiddleware.handle);
    }
    initializeRoutes() {
        // this.app.use('/api/topics', this.topicRoutes.getRouter());
        // this.app.use('/api/resources', this.resourceRoutes.getRouter());
        this.app.use('/api/users', this.userRoutes.getRouter());
        this.app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerConfig_1.swaggerSpec));
    }
    initializeErrorHandling() {
        this.app.use(this.errorHandler.handle);
    }
    async start(port) {
        try {
            // Run migrations
            await this.migrationRunner.up();
            console.log('Migrations applied successfully.');
            // Test database connection
            await this.dbConnection.query('SELECT 1');
        }
        catch (err) {
            console.error('Database setup failed:', err);
            process.exit(1);
        }
        try {
            this.app.listen(port, () => {
                console.log(`Server is running on ${env_1.ENV.SWAGGER_BASE_URL.replace('/api', '')}:${port}`);
            });
        }
        catch (err) {
            console.error('Server startup failed:', err);
            process.exit(1);
        }
    }
};
App = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(dbConnection_1.DbConnection)),
    __param(1, (0, inversify_1.inject)(authMiddleware_1.AuthMiddleware)),
    __param(2, (0, inversify_1.inject)(userRoutes_1.UserRoutes)),
    __param(3, (0, inversify_1.inject)(errorHandler_1.ErrorHandler)),
    __param(4, (0, inversify_1.inject)(migrationRunner_1.MigrationRunner)),
    __metadata("design:paramtypes", [dbConnection_1.DbConnection,
        authMiddleware_1.AuthMiddleware,
        userRoutes_1.UserRoutes,
        errorHandler_1.ErrorHandler,
        migrationRunner_1.MigrationRunner])
], App);
exports.App = App;
