import { inject, injectable } from 'inversify';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { TopicHistory } from '@topic/domain/entities/topicHistory';

interface TopicVersionInfo {
    version: number;
    createdAt: Date;
}

@injectable()
export class GetTopicHistory {
    private topicRepository: ITopicRepository;

    constructor(@inject('ITopicRepository') topicRepository: ITopicRepository) {
        this.topicRepository = topicRepository;
    }

    public async execute(topicId: string): Promise<TopicVersionInfo[]> {
        const topic = await this.topicRepository.findById(topicId);
        if (!topic) {
            throw new Error('Topic not found');
        }

        const topicHistory = await this.topicRepository.getTopicHistory(topicId);
        
        const versionHistory: TopicVersionInfo[] = topicHistory.map(history => ({
            version: history.version,
            createdAt: history.createdAt
        }));

        versionHistory.push({
            version: topic.version,
            createdAt: topic.updatedAt || topic.createdAt
        });

        return versionHistory.sort((a, b) => b.version - a.version);
    }
}