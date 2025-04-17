"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const authMiddleware_1 = require("../middleware/authMiddleware");
const errorHandler_1 = require("../middleware/errorHandler");
const container_1 = require("../../../modules/user/infrastructure/ioc/container");
// import { topicContainer } from '../../../modules/topic/infrastructure/ioc/container';
// import { resourceContainer } from '../../../modules/resource/infrastructure/ioc/container';
const dbConnection_1 = require("../database/dbConnection");
const migrationRunner_1 = require("../database/migrationRunner");
// Create a shared IoC container
const container = new inversify_1.Container();
exports.container = container;
// Bind shared dependencies
container.bind(authMiddleware_1.AuthMiddleware).toSelf();
container.bind(errorHandler_1.ErrorHandler).toSelf();
// Bind DbConnection instead
container.bind(dbConnection_1.DbConnection).toDynamicValue(() => {
    return dbConnection_1.DbConnection.getInstance();
});
// Bind MigrationRunner
container.bind(migrationRunner_1.MigrationRunner).toSelf();
// Provide a factory for creating DbConnection instances
container.bind('DbConnectionFactory').toFactory(() => {
    return () => dbConnection_1.DbConnection.getInstance();
});
// Load user module container
container.load(container_1.userContainer);
