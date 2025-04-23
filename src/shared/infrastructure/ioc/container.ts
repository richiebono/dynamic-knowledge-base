import 'reflect-metadata';
import { Container } from 'inversify';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { ErrorHandler } from '@shared/infrastructure/middleware/errorHandler';
import { userContainer } from '@user/infrastructure/ioc/container';
import { topicContainer } from '@topic/infrastructure/ioc/container';
import { resourceContainer } from '@resource/infrastructure/ioc/container';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';
import { ResourceDbConnection } from '@resource/infrastructure/database/resourceDbConnection';

// Create a shared IoC container
const container = new Container();

// Bind shared dependencies
container.bind(AuthMiddleware).toSelf();
container.bind(ErrorHandler).toSelf();
// Bind DbConnection para uso global pelo tipo/classe
container.bind<DbConnection>(DbConnection).toDynamicValue(() => {
    ResourceDbConnection.initializeInstance();
    return DbConnection.getInstance();
}).inSingletonScope();

// Load user module container
container.load(userContainer);
container.load(topicContainer);
container.load(resourceContainer);

export { container };
