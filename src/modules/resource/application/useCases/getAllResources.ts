import { inject, injectable } from 'inversify';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';

@injectable()
export class GetAllResources {
    constructor(@inject('IResourceRepository') private resourceRepository: IResourceRepository) {}

    public async execute(limit: number, offset: number, orderBy: string, orderDirection: string): Promise<{ resources: ResourceDTO[]; limit: number; offset: number }> {
        const resources = await this.resourceRepository.findAllPaginated(limit, offset, orderBy, orderDirection);
        return {
            resources: resources.map(resource => ({
                id: resource.id,
                topicId: resource.topicId,
                url: resource.url,
                description: resource.description,
                type: resource.type,
                createdAt: resource.createdAt,
                updatedAt: resource.updatedAt,
            })),
            limit,
            offset
        };
    }
}
