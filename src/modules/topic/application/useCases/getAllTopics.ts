import { inject, injectable } from 'inversify';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { Topic } from '@topic/domain/entities/topic';
import { TopicDTO } from '@topic/application/DTOs/topicDTO';

@injectable()
export class GetAllTopics {
    constructor(@inject('ITopicRepository') private topicRepository: ITopicRepository) {}

    async execute(limit: number, offset: number, orderBy: string, orderDirection: string): Promise<TopicDTO[]> {
        const topics: Topic[] = await this.topicRepository.getPaginatedTopics(limit, offset, orderBy, orderDirection);
        return topics.map(topic => this.MapToDTO(topic));
    }

    private MapToDTO(topic: Topic): TopicDTO {
        return {
            id: topic.id,
            name: topic.name,
            content: topic.content,
            createdAt: topic.createdAt,
            updatedAt: topic.updatedAt,
            version: topic.version,
            parentTopicId: topic.parentTopicId,
        };
    }
}
