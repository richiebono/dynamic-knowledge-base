import { inject, injectable } from 'inversify';
import { ITopicRepository } from '../../domain/interfaces/topicRepository';

@injectable()
export class DeleteTopic {
    constructor(@inject('ITopicRepository') private topicRepository: ITopicRepository) {}

    async execute(id: string): Promise<void> {
        const topic = await this.topicRepository.findById(id);
        if (!topic) {
            throw new Error(`Topic with id ${id} not found`);
        }
        await this.topicRepository.delete(id);
    }
}
