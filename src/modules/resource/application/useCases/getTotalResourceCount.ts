import { inject, injectable } from 'inversify';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';

@injectable()
export class GetTotalResourceCount {
    constructor(@inject('IResourceRepository') private resourceRepository: IResourceRepository) {}

    public async execute(): Promise<number> {
        return this.resourceRepository.getTotalResourceCount();
    }
}
