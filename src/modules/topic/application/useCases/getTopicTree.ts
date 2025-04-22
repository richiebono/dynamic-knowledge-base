import { inject, injectable } from 'inversify';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { TopicDTO } from '@topic/application/DTOs/topicDTO';
import { Topic } from '@topic/domain/entities/topic';

@injectable()
export class GetTopicTree {
    private topicRepository: ITopicRepository;

    constructor(@inject('ITopicRepository') topicRepository: ITopicRepository) {
        this.topicRepository = topicRepository;
    }

    public async execute(topicId: string): Promise<TopicDTO> {
        const topic = await this.topicRepository.findById(topicId);
        if (!topic) {
            throw new Error('Topic not found');
        }
        return this.buildTopicTree(topic);
    }

    private async buildTopicTree(topic: Topic): Promise<TopicDTO> {
        const subTopics = await this.topicRepository.findSubTopics(topic.id);
        const subTopicDTOs = await Promise.all(subTopics.map(subTopic => this.buildTopicTree(subTopic)));

        return {
            id: topic.id,
            name: topic.name,
            content: topic.content,
            createdAt: topic.createdAt,
            updatedAt: topic.updatedAt,
            version: topic.version,
            parentTopicId: topic.parentTopicId,
            subTopics: subTopicDTOs,
        };
    }
}