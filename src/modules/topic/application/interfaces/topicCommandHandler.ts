import { CreateTopicDTO, UpdateTopicDTO } from '@topic/application/DTOs/topicDTO';

export interface ITopicCommandHandler {
    createTopic(createTopicDTO: CreateTopicDTO): Promise<void>;
    updateTopic(id: string, updateTopicDTO: UpdateTopicDTO): Promise<void>;
    deleteTopic(id: string): Promise<void>;
}
