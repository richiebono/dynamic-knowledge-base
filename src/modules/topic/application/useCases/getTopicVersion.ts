import { inject, injectable } from 'inversify';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { TopicDTO } from '@topic/application/DTOs/topicDTO';
import { TopicHistory } from '@topic/domain/entities/topicHistory';

@injectable()
export class GetTopicVersion {
    private topicRepository: ITopicRepository;

    constructor(@inject('ITopicRepository') topicRepository: ITopicRepository) {
        this.topicRepository = topicRepository;
    }

    public async execute(topicId: string, version: number): Promise<TopicDTO> {
        const currentTopic = await this.topicRepository.findById(topicId);
        if (!currentTopic) {
            throw new Error('Topic not found');
        }

        if (currentTopic.version === version) {
            return this.mapToDTO(currentTopic);
        }

        const historicVersion = await this.topicRepository.getTopicVersion(topicId, version);
        if (!historicVersion) {
            throw new Error(`Version ${version} not found for topic ${topicId}`);
        }

        return this.mapHistoryToDTO(historicVersion);
    }

    private mapToDTO(topic: any): TopicDTO {
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

    private mapHistoryToDTO(topicHistory: TopicHistory): TopicDTO {
        return {
            id: topicHistory.topicId,
            name: topicHistory.name,
            content: topicHistory.content,
            createdAt: topicHistory.createdAt,
            version: topicHistory.version,
            parentTopicId: topicHistory.parentTopicId,
        };
    }
}