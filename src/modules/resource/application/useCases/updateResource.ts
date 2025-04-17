import { inject, injectable } from 'inversify';
import { IResourceRepository } from '../../domain/interfaces/resourceRepository';
import { ResourceDTO } from '../DTOs/resourceDTO';
import { Resource } from '../../domain/entities/resource';

@injectable()
export class UpdateResource {
    private resourceRepository: IResourceRepository;

    constructor(@inject('IResourceRepository') resourceRepository: IResourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    async execute(resourceId: string, resourceData: ResourceDTO): Promise<Resource> {
        const existingResource = await this.resourceRepository.findById(resourceId);
        if (!existingResource) {
            throw new Error('Resource not found');
        }

        const updatedResource = new Resource({
            id: existingResource.id,
            topicId: existingResource.topicId,
            url: resourceData.url || existingResource.url,
            description: resourceData.description || existingResource.description,
            type: resourceData.type || existingResource.type,
            createdAt: existingResource.createdAt,
            updatedAt: new Date(),
        });

        await this.resourceRepository.update(updatedResource);
        return updatedResource;
    }
}