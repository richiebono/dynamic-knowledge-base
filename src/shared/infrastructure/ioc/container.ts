import 'reflect-metadata';
import { Container } from 'inversify';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { ErrorHandler } from '../middleware/errorHandler';
import { userContainer } from '../../../modules/user/infrastructure/ioc/container';
import { topicContainer } from '../../../modules/topic/infrastructure/ioc/container';
import { resourceContainer } from '../../../modules/resource/infrastructure/ioc/container';
import { MigrationRunner } from '../database/migrationRunner';

// Create a shared IoC container
const container = new Container();

// Bind shared dependencies
container.bind(AuthMiddleware).toSelf();
container.bind(ErrorHandler).toSelf();


// Bind MigrationRunner
container.bind(MigrationRunner).toSelf();


// Load user module container
container.load(userContainer);
container.load(topicContainer);
container.load(resourceContainer);

export { container };
