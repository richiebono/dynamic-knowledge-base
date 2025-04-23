import { TopicDTO } from '@topic/application/DTOs/topicDTO';

export interface ITopicQueryHandler {
    getTopicById(topicId: string): Promise<any>;
    getTopicTree(topicId: string): Promise<any>;
    findShortestPath(startTopicId: string, endTopicId: string): Promise<any>;
    getAllTopics(limit: number, offset: number, orderBy: string, orderDirection: string): Promise<{ topics: TopicDTO[]; total: number; limit: number; offset: number }>;
    getTopicVersion(topicId: string, version: number): Promise<TopicDTO>;
    getTopicHistory(topicId: string): Promise<{ version: number; createdAt: Date }[]>;
}
