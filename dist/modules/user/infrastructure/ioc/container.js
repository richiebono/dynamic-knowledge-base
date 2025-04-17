"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userContainer = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const userCommandHandler_1 = require("../../application/handlers/userCommandHandler");
const userQueryHandler_1 = require("../../application/handlers/userQueryHandler");
const createUser_1 = require("../../application/useCases/createUser");
const updateUser_1 = require("../../application/useCases/updateUser");
const deleteUser_1 = require("../../application/useCases/deleteUser");
const getUserById_1 = require("../../application/useCases/getUserById");
const getAllUsers_1 = require("../../application/useCases/getAllUsers");
const userController_1 = require("../controllers/userController");
const userValidation_1 = require("../middleware/userValidation");
const userRepository_1 = require("../repository/userRepository");
const userRoutes_1 = require("../routes/userRoutes");
const dbConnection_1 = require("shared/infrastructure/database/dbConnection");
const userContainer = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    // Use the shared DbConnectionFactory to create a module-specific instance
    bind(dbConnection_1.DbConnection).toDynamicValue((context) => {
        const dbConnectionFactory = context.container.get('DbConnectionFactory');
        return dbConnectionFactory();
    });
    // Bind repositories
    bind('IUserRepository').to(userRepository_1.UserRepository);
    // Bind use cases
    bind(createUser_1.CreateUser).toSelf();
    bind(updateUser_1.UpdateUser).toSelf();
    bind(deleteUser_1.DeleteUser).toSelf();
    bind(getUserById_1.GetUserById).toSelf();
    bind(getAllUsers_1.GetAllUsers).toSelf();
    // Bind handlers
    bind('IUserCommandHandler').to(userCommandHandler_1.UserCommandHandler);
    bind('IUserQueryHandler').to(userQueryHandler_1.UserQueryHandler);
    // Bind controllers
    bind(userController_1.UserController).toSelf();
    // Bind middleware
    bind(userValidation_1.UserValidationMiddleware).toSelf();
    // Bind routes
    bind(userRoutes_1.UserRoutes).toSelf();
});
exports.userContainer = userContainer;
