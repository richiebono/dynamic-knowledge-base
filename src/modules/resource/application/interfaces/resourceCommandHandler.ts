import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';

export interface IResourceCommandHandler {
    createResource(resourceDTO: ResourceDTO): Promise<void>;
    updateResource(resourceId: string, resourceDTO: ResourceDTO): Promise<void>;
    deleteResource(resourceId: string): Promise<void>;
}
