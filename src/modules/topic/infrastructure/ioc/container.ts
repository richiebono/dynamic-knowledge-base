import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { ITopicRepository } from '../../domain/interfaces/topicRepository';
import { TopicController } from '../controllers/topicController';
import { TopicRoutes } from '../routes/topicRoutes';
import { ITopicCommandHandler } from '../../application/interfaces/topicCommandHandler';
import { TopicCommandHandler } from '../../application/handlers/topicCommandHandler';
import { ITopicQueryHandler } from '../../application/interfaces/topicQueryHandler';
import { TopicQueryHandler } from '../../application/handlers/topicQueryHandler';
import { CreateTopic } from '../../application/useCases/createTopic';
import { UpdateTopic } from '../../application/useCases/updateTopic';
import { DeleteTopic } from '../../application/useCases/deleteTopic';
import { GetTopicById } from '../../application/useCases/getTopicById';
import { GetTopicTree } from '../../application/useCases/getTopicTree';
import { FindShortestPath } from '../../application/useCases/findShortestPath';
import { TopicRepository } from '../repository/topicRepository';
import { DbConnection } from 'shared/infrastructure/database/dbConnection';
import { TopicDbConnection } from '../database/topicDbConnection';

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
