import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';
import { Resource } from '@resource/domain/entities/resource';

export interface IResourceCommandHandler {
    createResource(resourceDTO: ResourceDTO): Promise<Resource>;
    updateResource(resourceId: string, resourceDTO: ResourceDTO): Promise<void>;
    deleteResource(resourceId: string): Promise<void>;
    deleteResourcesByTopicId(topicId: string): Promise<void>;
}
