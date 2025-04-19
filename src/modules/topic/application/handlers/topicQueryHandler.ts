import { inject, injectable } from 'inversify';
import { GetTopicTree } from '../useCases/getTopicTree';
import { FindShortestPath } from '../useCases/findShortestPath';
import { ITopicQueryHandler } from '../interfaces/topicQueryHandler';
import { GetTopicById } from '../useCases/getTopicById';

@injectable()
export class TopicQueryHandler implements ITopicQueryHandler {
    constructor(
        @inject(GetTopicById) private getTopicByIdUseCase: GetTopicById,
        @inject(GetTopicTree) private getTopicTreeUseCase: GetTopicTree,
        @inject(FindShortestPath) private findShortestPathUseCase: FindShortestPath
    ) {}

    async getTopicById(topicId: string): Promise<any> {
        return await this.getTopicByIdUseCase.execute(topicId);
    }

    async getTopicTree(topicId: string): Promise<any> {
        return await this.getTopicTreeUseCase.execute(topicId);
    }

    async findShortestPath(startTopicId: string, endTopicId: string): Promise<any> {
        return await this.findShortestPathUseCase.execute(startTopicId, endTopicId);
    }
}
