import { CreateTopicDTO, UpdateTopicDTO } from '@topic/application/DTOs/topicDTO';

export interface ITopicCommandHandler {
    createTopic(createTopicDTO: CreateTopicDTO): Promise<{ id: string }>;
    updateTopic(id: string, updateTopicDTO: UpdateTopicDTO): Promise<void>;
    deleteTopic(id: string): Promise<void>;
}
