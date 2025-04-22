import { inject, injectable } from 'inversify';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';

@injectable()
export class GetResourceById {
    constructor(@inject('IResourceRepository') private resourceRepository: IResourceRepository) {}

    public async execute(resourceId: string): Promise<ResourceDTO | null> {
        const resource = await this.resourceRepository.findById(resourceId);
        return resource
            ? {
                  id: resource.id,
                  topicId: resource.topicId,
                  url: resource.url,
                  description: resource.description,
                  type: resource.type,
                  createdAt: resource.createdAt,
                  updatedAt: resource.updatedAt,
              }
            : null;
    }
}
