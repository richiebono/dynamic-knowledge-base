import { inject, injectable } from 'inversify';
import { ITopicRepository } from '../../domain/interfaces/topicRepository';

@injectable()
export class GetTopicById {
    constructor(@inject('ITopicRepository') private topicRepository: ITopicRepository) {}

    public async execute(topicId: string): Promise<any> {
        if (!topicId) {
            throw new Error('Topic ID is required');
        }

        const topic = await this.topicRepository.findById(topicId);
        if (!topic) {
            throw new Error('Topic not found');
        }

        return topic;
    }
}
