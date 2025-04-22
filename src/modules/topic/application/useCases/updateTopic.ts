import { inject, injectable } from 'inversify';
import { Topic } from '@topic/domain/entities/topic';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { UpdateTopicDTO } from '@topic/application/DTOs/topicDTO';

@injectable()
export class UpdateTopic {
    private topicRepository: ITopicRepository;

    constructor(
        @inject('ITopicRepository') topicRepository: ITopicRepository,
    ) {
        this.topicRepository = topicRepository;
    }

    async execute(topicId: string, updatedData: UpdateTopicDTO): Promise<Topic> {
        const topic = await this.topicRepository.findById(topicId);
        if (!topic) {
            throw new Error('Topic not found');
        }

        topic.update({
            name: updatedData.name,
            content: updatedData.content,
            parentTopicId: updatedData.parentTopicId,
        });

        return await this.topicRepository.update(topic);
    }
}