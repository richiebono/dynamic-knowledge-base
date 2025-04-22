import { inject, injectable } from 'inversify';
import { IResourceQueryHandler } from '@resource/application/interfaces/resourceQueryHandler';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';
import { GetAllResources } from '@resource/application/useCases/getAllResources';
import { GetTotalResourceCount } from '@resource/application/useCases/getTotalResourceCount';

@injectable()
export class ResourceQueryHandler implements IResourceQueryHandler {
    constructor(
        @inject(GetAllResources) private getAllResourcesUseCase: GetAllResources,
        @inject(GetTotalResourceCount) private getTotalResourceCountUseCase: GetTotalResourceCount,
        @inject("IResourceRepository") private resourceRepository: IResourceRepository
    ) {}

    public async getResourceById(resourceId: string): Promise<ResourceDTO | null> {
        const resource = await this.resourceRepository.findById(resourceId);
        return resource ? this.mapToDTO(resource) : null;
    }

    public async getResourcesByTopicId(topicId: string): Promise<ResourceDTO[]> {
        const resources = await this.resourceRepository.findByTopicId(topicId);
        return resources.map(this.mapToDTO);
    }

    public async getAllResources(limit: number, offset: number, orderBy: string, orderDirection: string): Promise<{ resources: ResourceDTO[]; total: number; limit: number; offset: number }> {
        const [resourcesResult, total] = await Promise.all([
            this.getAllResourcesUseCase.execute(limit, offset, orderBy, orderDirection),
            this.getTotalResourceCountUseCase.execute()
        ]);
        return {
            ...resourcesResult,
            total
        };
    }

    private mapToDTO(resource: any): ResourceDTO {
        return {
            id: resource.id,
            topicId: resource.topicId,
            url: resource.url,
            description: resource.description,
            type: resource.type,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt ?? new Date(),
        };
    }
}
