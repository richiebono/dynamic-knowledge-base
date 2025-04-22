import 'reflect-metadata';
import { Container } from 'inversify';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { MigrationRunner } from '@shared/infrastructure/database/migrationRunner';
import { ErrorHandler } from '@shared/infrastructure/middleware/errorHandler';
import { userContainer } from '@user/infrastructure/ioc/container';
import { topicContainer } from '@topic/infrastructure/ioc/container';
import { resourceContainer } from '@resource/infrastructure/ioc/container';

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
