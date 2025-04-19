import { inject, injectable } from 'inversify';
import { ITopicRepository } from '../../domain/interfaces/topicRepository';
import { Topic } from '../../domain/entities/topic';

@injectable()
export class FindShortestPath {
    private topicRepository: ITopicRepository;

    constructor(@inject('ITopicRepository') topicRepository: ITopicRepository) {
        this.topicRepository = topicRepository;
    }

    public async execute(startTopicId: string, endTopicId: string): Promise<string[]> {
        const visited: Set<string> = new Set();
        const path: string[] = [];

        const findPath = async (currentId: string): Promise<boolean> => {
            if (currentId === endTopicId) {
                path.push(currentId);
                return true;
            }

            visited.add(currentId);
            const currentTopic: Topic | null = await this.topicRepository.findById(currentId);

            if (!currentTopic) {
                return false;
            }

            const subTopics = await this.topicRepository.findSubTopics(currentId);

            for (const subTopic of subTopics) {
                if (!visited.has(subTopic.id)) {
                    const found = await findPath(subTopic.id);
                    if (found) {
                        path.push(currentId);
                        return true;
                    }
                }
            }

            return false;
        };

        await findPath(startTopicId);
        return path.reverse();
    }
}