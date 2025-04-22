import { inject, injectable } from 'inversify';
import { Resource } from '@resource/domain/entities/resource';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';

@injectable()
export class CreateResource {
    private resourceRepository: IResourceRepository;

    constructor(
        @inject('IResourceRepository') resourceRepository: IResourceRepository
    ) {
        this.resourceRepository = resourceRepository;
    }

    public async execute(resourceDTO: ResourceDTO): Promise<Resource> {
        const resource = new Resource({
            id: resourceDTO.id,
            topicId: resourceDTO.topicId,
            url: resourceDTO.url,
            description: resourceDTO.description,
            type: resourceDTO.type,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return await this.resourceRepository.create(resource);
    }
}