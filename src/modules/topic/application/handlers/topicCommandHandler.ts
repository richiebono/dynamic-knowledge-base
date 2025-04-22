import { inject, injectable } from 'inversify';
import { CreateTopic } from '@topic/application/useCases/createTopic';
import { UpdateTopic } from '@topic/application/useCases/updateTopic';
import { CreateTopicDTO, UpdateTopicDTO } from '@topic/application/DTOs/topicDTO';
import { ITopicCommandHandler } from '@topic/application/interfaces/topicCommandHandler';
import { DeleteTopic } from '@topic/application/useCases/deleteTopic';

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