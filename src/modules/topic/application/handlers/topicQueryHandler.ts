import { inject, injectable } from 'inversify';
import { GetTopicTree } from '@topic/application/useCases/getTopicTree';
import { FindShortestPath } from '@topic/application/useCases/findShortestPath';
import { ITopicQueryHandler } from '@topic/application/interfaces/topicQueryHandler';
import { GetTopicById } from '@topic/application/useCases/getTopicById';
import { GetAllTopics } from '@topic/application/useCases/getAllTopics';
import { TopicDTO } from '@topic/application/DTOs/topicDTO';
import { GetTotalTopicsCount } from '@topic/application/useCases/getTotalTopicsCount';
import { GetTopicVersion } from '@topic/application/useCases/getTopicVersion';
import { GetTopicHistory } from '@topic/application/useCases/getTopicHistory';

@injectable()
export class TopicQueryHandler implements ITopicQueryHandler {
    constructor(
        @inject(GetTopicById) private getTopicByIdUseCase: GetTopicById,
        @inject(GetTopicTree) private getTopicTreeUseCase: GetTopicTree,
        @inject(FindShortestPath) private findShortestPathUseCase: FindShortestPath,
        @inject(GetAllTopics) private getAllTopicsUseCase: GetAllTopics,
        @inject(GetTotalTopicsCount) private getTotalTopicsCountUseCase: GetTotalTopicsCount,
        @inject(GetTopicVersion) private getTopicVersionUseCase: GetTopicVersion,
        @inject(GetTopicHistory) private getTopicHistoryUseCase: GetTopicHistory
    ) {}

    async getTopicById(topicId: string): Promise<TopicDTO> {
        return await this.getTopicByIdUseCase.execute(topicId);
    }

    async getTopicTree(topicId: string): Promise<TopicDTO> {
        return await this.getTopicTreeUseCase.execute(topicId);
    }

    async findShortestPath(startTopicId: string, endTopicId: string): Promise<any> {
        return await this.findShortestPathUseCase.execute(startTopicId, endTopicId);
    }

    async getAllTopics(limit: number, offset: number, orderBy: string, orderDirection: string): Promise<{ topics: TopicDTO[]; total: number; limit: number; offset: number }> {
        const [topics, total] = await Promise.all([
            this.getAllTopicsUseCase.execute(limit, offset, orderBy, orderDirection),
            this.getTotalTopicsCountUseCase.execute()
        ]);
        return { topics, total, limit, offset };
    }

    async getTopicVersion(topicId: string, version: number): Promise<TopicDTO> {
        return await this.getTopicVersionUseCase.execute(topicId, version);
    }

    async getTopicHistory(topicId: string): Promise<{ version: number; createdAt: Date }[]> {
        return await this.getTopicHistoryUseCase.execute(topicId);
    }
}
