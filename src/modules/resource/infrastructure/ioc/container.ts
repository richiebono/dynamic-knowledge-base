import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { ResourceController } from '@resource/infrastructure/controllers/resourceController';
import { ResourceRoutes } from '@resource/infrastructure/routes/resourceRoutes';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';
import { ResourceDbConnection } from '@resource/infrastructure/database/resourceDbConnection';
import { ResourceRepository } from '@resource/infrastructure/repository/resourceRepository';

const resourceContainer = new ContainerModule((bind: interfaces.Bind) => {
    // Use ResourceDbConnection for the resource module
    bind<ResourceDbConnection>(ResourceDbConnection).toDynamicValue(() => {
        ResourceDbConnection.initializeInstance();
        return DbConnection.getInstance() as ResourceDbConnection;
    });

    // Bind repositories
    bind<IResourceRepository>('IResourceRepository').to(ResourceRepository);

    // Bind controllers
    bind(ResourceController).toSelf();

    // Bind routes
    bind(ResourceRoutes).toSelf();
});

export { resourceContainer };
