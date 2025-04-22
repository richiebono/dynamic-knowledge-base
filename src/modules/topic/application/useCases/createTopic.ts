import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { Topic } from '@topic/domain/entities/topic';
import { CreateTopicDTO, TopicDTO } from '@topic/application/DTOs/topicDTO';

@injectable()
export class CreateTopic {
    private topicRepository: ITopicRepository;

    constructor(@inject('ITopicRepository') topicRepository: ITopicRepository) {
        this.topicRepository = topicRepository;
    }

    public async execute(topicDTO: CreateTopicDTO): Promise<Topic> {
        const topic = new Topic({
            id: uuidv4(),
            name: topicDTO.name,
            content: topicDTO.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            parentTopicId: topicDTO.parentTopicId,
        });

        return await this.topicRepository.create(topic);
    }
}