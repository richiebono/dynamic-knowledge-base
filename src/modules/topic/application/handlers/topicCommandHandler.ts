import { inject, injectable } from 'inversify';
import { CreateTopic } from '../useCases/createTopic';
import { UpdateTopic } from '../useCases/updateTopic';
import { CreateTopicDTO, UpdateTopicDTO } from '../DTOs/topicDTO';
import { ITopicCommandHandler } from '../interfaces/topicCommandHandler';
import { DeleteTopic } from '../useCases/deleteTopic';

@injectable()
export class TopicCommandHandler implements ITopicCommandHandler {
    constructor(
        @inject(CreateTopic) private createTopicUseCase: CreateTopic,
        @inject(UpdateTopic) private updateTopicUseCase: UpdateTopic,
        @inject(DeleteTopic) private deleteTopicUseCase: DeleteTopic
    ) {}

    async createTopic(createTopicDTO: CreateTopicDTO): Promise<void> {
        await this.createTopicUseCase.execute(createTopicDTO);
    }

    async updateTopic(id: string, updateTopicDTO: UpdateTopicDTO): Promise<void> {
        await this.updateTopicUseCase.execute(id, updateTopicDTO);
    }

    async deleteTopic(id: string): Promise<void> {
        await this.deleteTopicUseCase.execute(id);
    }
}