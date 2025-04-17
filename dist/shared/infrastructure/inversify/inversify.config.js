"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const topicRepositoryImpl_1 = require("../../modules/topic/infrastructure/database/topicRepositoryImpl");
const resourceRepositoryImpl_1 = require("../../modules/resource/infrastructure/database/resourceRepositoryImpl");
const userRepositoryImpl_1 = require("../../modules/user/infrastructure/database/userRepositoryImpl");
const consoleLogger_1 = require("../../shared/infrastructure/logger/consoleLogger");
const container = new inversify_1.Container();
exports.container = container;
// Bind repositories
container.bind('TopicRepository').to(topicRepositoryImpl_1.TopicRepositoryImpl);
container.bind('ResourceRepository').to(resourceRepositoryImpl_1.ResourceRepositoryImpl);
container.bind('UserRepository').to(userRepositoryImpl_1.UserRepositoryImpl);
// Bind logger
container.bind('Logger').to(consoleLogger_1.ConsoleLogger);
