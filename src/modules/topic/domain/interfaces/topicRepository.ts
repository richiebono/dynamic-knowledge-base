import { Topic } from '@topic/domain/entities/topic';
import { TopicHistory } from '@topic/domain/entities/topicHistory';

export interface ITopicRepository {
    findSubTopics(currentId: string): Promise<Topic[]>;
    create(topic: Topic): Promise<Topic>;
    update(topic: Topic): Promise<Topic>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Topic | null>;
    findAll(): Promise<Topic[]>;
    findByParentId(parentTopicId: string): Promise<Topic[]>;
    findVersionById(id: string, version: number): Promise<Topic | null>;
    getPaginatedTopics(limit: number, offset: number, orderBy: string, orderDirection: string): Promise<Topic[]>;
    getTotalTopicsCount(): Promise<number>;
    createTopicHistory(topicHistory: TopicHistory): Promise<TopicHistory>;
    getTopicHistory(topicId: string): Promise<TopicHistory[]>;
    getTopicVersion(topicId: string, version: number): Promise<TopicHistory | null>;
}