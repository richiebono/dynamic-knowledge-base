import { Topic } from '@topic/domain/entities/topic';

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
}