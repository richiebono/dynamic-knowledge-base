import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { TopicController } from '@topic/infrastructure/controllers/topicController';
import { TopicRoutes } from '@topic/infrastructure/routes/topicRoutes';
import { ITopicCommandHandler } from '@topic/application/interfaces/topicCommandHandler';
import { TopicCommandHandler } from '@topic/application/handlers/topicCommandHandler';
import { ITopicQueryHandler } from '@topic/application/interfaces/topicQueryHandler';
import { TopicQueryHandler } from '@topic/application/handlers/topicQueryHandler';
import { CreateTopic } from '@topic/application/useCases/createTopic';
import { UpdateTopic } from '@topic/application/useCases/updateTopic';
import { DeleteTopic } from '@topic/application/useCases/deleteTopic';
import { GetTopicById } from '@topic/application/useCases/getTopicById';
import { GetTopicTree } from '@topic/application/useCases/getTopicTree';
import { FindShortestPath } from '@topic/application/useCases/findShortestPath';
import { TopicRepository } from '@topic/infrastructure/repository/topicRepository';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';
import { TopicDbConnection } from '@topic/infrastructure/database/topicDbConnection';

const topicContainer = new ContainerModule((bind: interfaces.Bind) => {
    // Use TopicDbConnection for the topic module
    bind<TopicDbConnection>(TopicDbConnection).toDynamicValue(() => {
        TopicDbConnection.initializeInstance();
        return DbConnection.getInstance() as TopicDbConnection;
    });

    // Bind repositories
    bind<ITopicRepository>('ITopicRepository').to(TopicRepository);

    // Bind use cases
    bind(CreateTopic).toSelf();
    bind(UpdateTopic).toSelf();
    bind(DeleteTopic).toSelf();
    bind(GetTopicById).toSelf();
    bind(GetTopicTree).toSelf();
    bind(FindShortestPath).toSelf();

    // Bind handlers
    bind<ITopicCommandHandler>('ITopicCommandHandler').to(TopicCommandHandler);
    bind<ITopicQueryHandler>('ITopicQueryHandler').to(TopicQueryHandler);

    // Bind controllers
    bind(TopicController).toSelf();

    // Bind routes
    bind(TopicRoutes).toSelf();
});

export { topicContainer };
