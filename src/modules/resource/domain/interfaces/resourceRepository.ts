import { Resource } from "../entities/resource";

export interface IResourceRepository {
    create(resource: Resource): Promise<Resource>;
    update(resource: Resource): Promise<Resource>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Resource | null>;
    findAll(): Promise<Resource[]>;
    findByTopicId(topicId: string): Promise<Resource[]>;
}