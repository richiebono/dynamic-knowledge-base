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
        
        await this.resourceCommandHandler.deleteResourcesByTopicId(id);
        
        await this.topicRepository.delete(id);
    }
}
