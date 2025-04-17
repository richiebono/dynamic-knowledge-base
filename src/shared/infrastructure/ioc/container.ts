import 'reflect-metadata';
import { Container } from 'inversify';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { ErrorHandler } from '../middleware/errorHandler';
import { userContainer } from '../../../modules/user/infrastructure/ioc/container';
// import { topicContainer } from '../../../modules/topic/infrastructure/ioc/container';
// import { resourceContainer } from '../../../modules/resource/infrastructure/ioc/container';
import { DbConnection } from '../database/dbConnection';
import { MigrationRunner } from '../database/migrationRunner';

// Create a shared IoC container
const container = new Container();

// Bind shared dependencies
container.bind(AuthMiddleware).toSelf();
container.bind(ErrorHandler).toSelf();

// Bind DbConnection instead
container.bind(DbConnection).toDynamicValue(() => {
    return DbConnection.getInstance();
});

// Bind MigrationRunner
container.bind(MigrationRunner).toSelf();

// Provide a factory for creating DbConnection instances
container.bind<() => DbConnection>('DbConnectionFactory').toFactory(() => {
    return () => DbConnection.getInstance();
});

// Load user module container
container.load(userContainer);
// container.load(topicContainer);
// container.load(resourceContainer);

export { container };
