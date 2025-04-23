import { inject, injectable } from 'inversify';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { IResourceCommandHandler } from '@resource/application/interfaces/resourceCommandHandler';

@injectable()
export class DeleteTopic {
    constructor(
        @inject('ITopicRepository') private topicRepository: ITopicRepository,
        @inject('IResourceCommandHandler') private resourceCommandHandler: IResourceCommandHandler
    ) {}

    async execute(id: string): Promise<void> {
        const topic = await this.topicRepository.findById(id);
        if (!topic) {
            throw new Error(`Topic with id ${id} not found`);
        }
        
        const childTopics = await this.topicRepository.findByParentId(id);
        if (childTopics.length > 0) {
            throw new Error(`Cannot delete topic with id ${id} because it ha topics. Delete all child topics first.`);
        }
        
        await this.resourceCommandHandler.deleteResourcesByTopicId(id);
        
        await this.topicRepository.delete(id);
    }
}
