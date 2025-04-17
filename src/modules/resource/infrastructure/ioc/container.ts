import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { IResourceRepository } from '../../domain/interfaces/resourceRepository';
import { ResourceController } from '../controllers/resourceController';
import { ResourceRoutes } from '../routes/resourceRoutes';
import { DbConnection } from 'shared/infrastructure/database/dbConnection';
import { ResourceDbConnection } from '../database/resourceDbConnection';
import { ResourceRepository } from '../repository/resourceRepository';

const resourceContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<DbConnection>(DbConnection).toDynamicValue((context) => {
        const dbConnectionFactory = context.container.get<() => DbConnection>('DbConnectionFactory');
        return dbConnectionFactory();
    });

    // Bind repositories
    bind<IResourceRepository>('IResourceRepository').to(ResourceRepository);

    // Bind controllers
    bind(ResourceController).toSelf();

    // Bind routes
    bind(ResourceRoutes).toSelf();
});

export { resourceContainer };
