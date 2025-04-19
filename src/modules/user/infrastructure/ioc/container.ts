import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { IUserRepository } from '../../domain/interfaces/userRepository';
import { IUserCommandHandler } from '../../application/interfaces/userCommandHandler';
import { UserCommandHandler } from '../../application/handlers/userCommandHandler';
import { IUserQueryHandler } from '../../application/interfaces/userQueryHandler';
import { UserQueryHandler } from '../../application/handlers/userQueryHandler';
import { CreateUser } from '../../application/useCases/createUser';
import { UpdateUser } from '../../application/useCases/updateUser';
import { DeleteUser } from '../../application/useCases/deleteUser';
import { GetUserById } from '../../application/useCases/getUserById';
import { GetAllUsers } from '../../application/useCases/getAllUsers';
import { UserController } from '../controllers/userController';
import { UserValidationMiddleware } from '../middleware/userValidation';
import { UserRepository } from '../repository/userRepository';
import { UserRoutes } from '../routes/userRoutes';
import { UserDbConnection } from '../database/userDbConnection';
import { DbConnection } from '../../../../shared/infrastructure/database/dbConnection';

const userContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {
    // Use UserDbConnection for the user module
    bind<UserDbConnection>(UserDbConnection).toDynamicValue(() => {
        UserDbConnection.initializeInstance();
        return DbConnection.getInstance() as UserDbConnection;
    });
    
    // Bind repositories
    bind<IUserRepository>('IUserRepository').to(UserRepository);

    // Bind use cases
    bind(CreateUser).toSelf();
    bind(UpdateUser).toSelf();
    bind(DeleteUser).toSelf();
    bind(GetUserById).toSelf();
    bind(GetAllUsers).toSelf();

    // Bind handlers
    bind<IUserCommandHandler>('IUserCommandHandler').to(UserCommandHandler);
    bind<IUserQueryHandler>('IUserQueryHandler').to(UserQueryHandler);

    // Bind controllers
    bind(UserController).toSelf();

    // Bind middleware
    bind(UserValidationMiddleware).toSelf();

    // Bind routes
    bind(UserRoutes).toSelf();
});

export { userContainer };
