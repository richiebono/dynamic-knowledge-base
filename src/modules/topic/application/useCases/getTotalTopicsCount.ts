import { inject, injectable } from 'inversify';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';

@injectable()
export class GetTotalTopicsCount {
    constructor(@inject('ITopicRepository') private topicRepository: ITopicRepository) {}

    async execute(): Promise<number> {
        return await this.topicRepository.getTotalTopicsCount();
    }
}
