import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { ResourceController } from '@resource/infrastructure/controllers/resourceController';
import { ResourceRoutes } from '@resource/infrastructure/routes/resourceRoutes';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';
import { ResourceDbConnection } from '@resource/infrastructure/database/resourceDbConnection';
import { ResourceRepository } from '@resource/infrastructure/repository/resourceRepository';
import { IResourceCommandHandler } from '@resource/application/interfaces/resourceCommandHandler';
import { ResourceCommandHandler } from '@resource/application/handlers/resourceCommandHandler';
import { CreateResource } from '@resource/application/useCases/createResource';
import { UpdateResource } from '@resource/application/useCases/updateResource';
import { DeleteResource } from '@resource/application/useCases/deleteResource';
import { GetAllResources } from '@resource/application/useCases/getAllResources';
import { GetTotalResourceCount } from '@resource/application/useCases/getTotalResourceCount';
import { GetResourceById } from '@resource/application/useCases/getResourceById';
import { GetResourcesByTopicId } from '@resource/application/useCases/getResourcesByTopicId';
import { IResourceQueryHandler } from '@resource/application/interfaces/resourceQueryHandler';
import { ResourceQueryHandler } from '@resource/application/handlers/resourceQueryHandler';
import { ResourceValidationMiddleware } from '@resource/infrastructure/middleware/resourceValidation';

const resourceContainer = new ContainerModule((bind: interfaces.Bind) => {
    // Use ResourceDbConnection for the resource module
    bind<ResourceDbConnection>(ResourceDbConnection).toDynamicValue(() => {
        ResourceDbConnection.initializeInstance();
        return DbConnection.getInstance() as ResourceDbConnection;
    });

    // Bind repositories
    bind<IResourceRepository>('IResourceRepository').to(ResourceRepository);

    // Bind command handler
    bind<IResourceCommandHandler>('IResourceCommandHandler').to(ResourceCommandHandler);

    // Bind query handler
    bind<IResourceQueryHandler>('IResourceQueryHandler').to(ResourceQueryHandler);

    // Bind use cases
    bind(CreateResource).toSelf();
    bind(UpdateResource).toSelf();
    bind(DeleteResource).toSelf();
    bind(GetAllResources).toSelf();
    bind(GetTotalResourceCount).toSelf();
    bind(GetResourceById).toSelf();
    bind(GetResourcesByTopicId).toSelf();

    // Bind controllers
    bind(ResourceController).toSelf();

    // Bind routes
    bind(ResourceRoutes).toSelf();

    bind(ResourceValidationMiddleware).toSelf();
});

export { resourceContainer };
