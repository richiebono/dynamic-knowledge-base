import { Resource } from '@resource/domain/entities/resource';

export interface IResourceRepository {
    create(resource: Resource): Promise<Resource>;
    update(resource: Resource): Promise<Resource>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Resource | null>;
    findAll(): Promise<Resource[]>;
    findByTopicId(topicId: string): Promise<Resource[]>;
    findAllPaginated(limit: number, offset: number, orderBy: string, orderDirection: string): Promise<Resource[]>;
    getTotalResourceCount(): Promise<number>;
}