import { inject, injectable } from 'inversify';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';

@injectable()
export class DeleteResourcesByTopicId {
    constructor(
        @inject('IResourceRepository') private resourceRepository: IResourceRepository
    ) {}

    public async execute(topicId: string): Promise<void> {
        await this.resourceRepository.deleteByTopicId(topicId);
    }
}