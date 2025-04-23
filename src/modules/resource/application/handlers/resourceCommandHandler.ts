import { inject, injectable } from 'inversify';
import { IResourceCommandHandler } from '@resource/application/interfaces/resourceCommandHandler';
import { CreateResource } from '@resource/application/useCases/createResource';
import { UpdateResource } from '@resource/application/useCases/updateResource';
import { DeleteResource } from '@resource/application/useCases/deleteResource';
import { DeleteResourcesByTopicId } from '@resource/application/useCases/deleteResourcesByTopicId';
import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';
import { Resource } from '@resource/domain/entities/resource';


@injectable()
export class ResourceCommandHandler implements IResourceCommandHandler {
    constructor(
        @inject(CreateResource) private createResourceUseCase: CreateResource,
        @inject(UpdateResource) private updateResourceUseCase: UpdateResource,
        @inject(DeleteResource) private deleteResourceUseCase: DeleteResource,
        @inject(DeleteResourcesByTopicId) private deleteResourcesByTopicIdUseCase: DeleteResourcesByTopicId
    ) {}
    

    public async createResource(dto: ResourceDTO): Promise<Resource> {
        return await this.createResourceUseCase.execute(dto);
    }

    public async updateResource(id: string, dto: ResourceDTO): Promise<void> {
        await this.updateResourceUseCase.execute(id, dto);
    }

    public async deleteResource(resourceId: string): Promise<void> {
        await this.deleteResourceUseCase.execute(resourceId);
    }

    public async deleteResourcesByTopicId(topicId: string): Promise<void> {
        await this.deleteResourcesByTopicIdUseCase.execute(topicId);
    }
}