import { inject, injectable } from 'inversify';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';

@injectable()
export class GetResourcesByTopicId {
    constructor(@inject('IResourceRepository') private resourceRepository: IResourceRepository) {}

    public async execute(topicId: string): Promise<ResourceDTO[]> {
        const resources = await this.resourceRepository.findByTopicId(topicId);
        return resources.map(resource => ({
            id: resource.id,
            topicId: resource.topicId,
            url: resource.url,
            description: resource.description,
            type: resource.type,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        }));
    }
}
