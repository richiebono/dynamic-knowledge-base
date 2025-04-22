import { inject, injectable } from 'inversify';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';

@injectable()
export class DeleteResource {
    constructor(
        @inject('IResourceRepository') private resourceRepository: IResourceRepository
    ) {}

    public async execute(resourceId: string): Promise<void> {
        await this.resourceRepository.delete(resourceId);
    }
}
