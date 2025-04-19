import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ITopicCommandHandler } from '../../application/interfaces/topicCommandHandler';
import { ITopicQueryHandler } from 'modules/topic/application/interfaces/topicQueryHandler';

@injectable()
export class TopicController {
    private topicCommandHandler: ITopicCommandHandler;
    private topicQueryHandler: ITopicQueryHandler;
    
    constructor(
        @inject('ITopicCommandHandler') topicCommandHandler: ITopicCommandHandler,
        @inject('ITopicQueryHandler') topicQueryHandler: ITopicQueryHandler
    ) {
        this.topicCommandHandler = topicCommandHandler;
        this.topicQueryHandler = topicQueryHandler;
    }

    public async createTopic(req: Request, res: Response): Promise<void> {
        try {
            const topicDTO = req.body;
            await this.topicCommandHandler.createTopic(topicDTO);
            res.status(201).json({ message: 'Topic created successfully' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on createTopic';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async updateTopic(req: Request, res: Response): Promise<void> {
        try {
            const topicId = req.params.id;
            const topicDTO = req.body;
            await this.topicCommandHandler.updateTopic(topicId, topicDTO);
            res.status(200).json({ message: 'Topic updated successfully' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on updateTopic';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async getTopicById(req: Request, res: Response): Promise<void> {
        try {
            const topicId = req.params.id;
            const topic = await this.topicQueryHandler.getTopicById(topicId);
            if (!topic) {
                res.status(404).json({ message: 'Topic not found' });
                return;
            }
            res.status(200).json(topic);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on getTopicById';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async getTopicTree(req: Request, res: Response): Promise<void> {
        try {
            const topicId = req.params.id;
            const topicTree = await this.topicQueryHandler.getTopicTree(topicId);
            res.status(200).json(topicTree);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on getTopicTree';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async findShortestPath(req: Request, res: Response): Promise<void> {
        try {
            const { startTopicId, endTopicId } = req.body;
            const path = await this.topicQueryHandler.findShortestPath(startTopicId, endTopicId);
            res.status(200).json(path);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on findShortestPath';
            res.status(500).json({ message: errorMessage });
        }
    }
}