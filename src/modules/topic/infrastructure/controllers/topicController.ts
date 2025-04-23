import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ITopicCommandHandler } from '@topic/application/interfaces/topicCommandHandler';
import { ITopicQueryHandler } from '@topic/application/interfaces/topicQueryHandler';
import { CreatedTopicRequestDTO, CreateTopicDTO } from '@topic/application/DTOs/topicDTO';

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
            const topicDTO = { ...req.body as CreateTopicDTO, createdBy: (req.user as any)?.id };
            const { id } = await this.topicCommandHandler.createTopic(topicDTO);
            res.status(201).json({ message: 'Topic created successfully', data: { id } });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on createTopic';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async updateTopic(req: Request, res: Response): Promise<void> {
        try {
            const topicId = req.params.id;
            const topicDTO = { ...req.body as CreatedTopicRequestDTO, updatedBy: (req.user as any)?.id };
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

    public async getAllTopics(req: Request, res: Response): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const orderBy = (req.query.orderBy as string) || 'createdAt';
            const orderDirection = (req.query.orderDirection as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
            
            const response = await this.topicQueryHandler.getAllTopics(limit, offset, orderBy, orderDirection);
            res.status(200).json(response);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on getAllTopics';
            res.status(500).json({ message: errorMessage });
        }
    }
}