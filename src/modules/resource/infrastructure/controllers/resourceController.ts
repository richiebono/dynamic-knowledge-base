import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IResourceCommandHandler } from '../../application/interfaces/resourceCommandHandler';
import { IResourceQueryHandler } from '../../application/interfaces/resourceQueryHandler';

@injectable()
export class ResourceController {
    private resourceCommandHandler: IResourceCommandHandler;
    private resourceQueryHandler: IResourceQueryHandler;

    constructor(
        @inject("IResourceCommandHandler") resourceCommandHandler: IResourceCommandHandler,
        @inject("IResourceQueryHandler") resourceQueryHandler: IResourceQueryHandler
    ) {
        this.resourceCommandHandler = resourceCommandHandler;
        this.resourceQueryHandler = resourceQueryHandler;
    }

    public async createResource(req: Request, res: Response): Promise<void> {
        try {
            const resourceDTO = req.body;
            await this.resourceCommandHandler.createResource(resourceDTO);
            res.status(201).json({ message: 'Resource created successfully' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on createResource';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async updateResource(req: Request, res: Response): Promise<void> {
        try {
            const resourceId = req.params.id;
            const resourceDTO = req.body;
            await this.resourceCommandHandler.updateResource(resourceId, resourceDTO);
            res.status(200).json({ message: 'Resource updated successfully' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on updateResource';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async getResource(req: Request, res: Response): Promise<void> {
        try {
            const resourceId = req.params.id;
            const resource = await this.resourceQueryHandler.getResourceById(resourceId);
            if (!resource) {
                res.status(404).json({ message: 'Resource not found' });
                return;
            }
            res.status(200).json(resource);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on getResource';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async getResourcesByTopicId(req: Request, res: Response): Promise<void> {
        try {
            const topicId = req.params.topicId;
            const resources = await this.resourceQueryHandler.getResourcesByTopicId(topicId);
            res.status(200).json(resources);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on getResourcesByTopicId';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async deleteResource(req: Request, res: Response): Promise<void> {
        try {
            const resourceId = req.params.id;
            await this.resourceCommandHandler.deleteResource(resourceId);
            res.status(204).send();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on deleteResource';
            res.status(500).json({ message: errorMessage });
        }
    }
}