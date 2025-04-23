import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';
import { IUserRepository } from '@user/domain/interfaces/userRepository';
import { IUserCommandHandler } from '@user/application/interfaces/userCommandHandler';
import { UserCommandHandler } from '@user/application/handlers/userCommandHandler';
import { IUserQueryHandler } from '@user/application/interfaces/userQueryHandler';
import { UserQueryHandler } from '@user/application/handlers/userQueryHandler';
import { CreateUser } from '@user/application/useCases/createUser';
import { UpdateUser } from '@user/application/useCases/updateUser';
import { DeleteUser } from '@user/application/useCases/deleteUser';
import { GetUserById } from '@user/application/useCases/getUserById';
import { GetAllUsers } from '@user/application/useCases/getAllUsers';
import { GetTotalUsersCount } from '@user/application/useCases/getTotalUsersCount';
import { LoginUser } from '@user/application/useCases/loginUser';
import { UserController } from '@user/infrastructure/controllers/userController';
import { UserValidationMiddleware } from '@user/infrastructure/middleware/userValidation';
import { UserRepository } from '@user/infrastructure/repository/userRepository';
import { UserRoutes } from '@user/infrastructure/routes/userRoutes';
import { UserDbConnection } from '@user/infrastructure/database/userDbConnection';


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
    bind(GetTotalUsersCount).toSelf();
    bind(LoginUser).toSelf();

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
