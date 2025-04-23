import { inject, injectable } from 'inversify';
import { IResourceCommandHandler } from '../interfaces/resourceCommandHandler';
import { CreateResource } from '../useCases/createResource';
import { UpdateResource } from '../useCases/updateResource';
import { DeleteResource } from '../useCases/deleteResource';
import { DeleteResourcesByTopicId } from '../useCases/deleteResourcesByTopicId';
import { ResourceDTO } from '../DTOs/resourceDTO';


@injectable()
export class ResourceCommandHandler implements IResourceCommandHandler {
    constructor(
        @inject(CreateResource) private createResourceUseCase: CreateResource,
        @inject(UpdateResource) private updateResourceUseCase: UpdateResource,
        @inject(DeleteResource) private deleteResourceUseCase: DeleteResource,
        @inject(DeleteResourcesByTopicId) private deleteResourcesByTopicIdUseCase: DeleteResourcesByTopicId
    ) {}
    

    public async createResource(dto: ResourceDTO): Promise<void> {
        await this.createResourceUseCase.execute(dto);
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