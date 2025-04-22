import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';

export interface IResourceQueryHandler {
    getResourceById(resourceId: string): Promise<ResourceDTO | null>;
    getResourcesByTopicId(topicId: string): Promise<ResourceDTO[]>;
    getAllResources(limit: number, offset: number, orderBy: string, orderDirection: string): Promise<{ resources: ResourceDTO[]; total: number; limit: number; offset: number }>;
}
