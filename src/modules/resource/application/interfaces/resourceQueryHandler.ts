import { ResourceDTO } from '../DTOs/resourceDTO';

export interface IResourceQueryHandler {
    getResourceById(resourceId: string): Promise<ResourceDTO | null>;
    getResourcesByTopicId(topicId: string): Promise<ResourceDTO[]>;
}
