import 'reflect-metadata';
import { TopicController } from '@topic/infrastructure/controllers/topicController';
import { ITopicCommandHandler } from '@topic/application/interfaces/topicCommandHandler';
import { ITopicQueryHandler } from '@topic/application/interfaces/topicQueryHandler';
import { Request, Response } from 'express';
import { TopicDTO, CreateTopicDTO, UpdateTopicDTO, CreatedTopicRequestDTO, UpdateTopicRequestDTO } from '@topic/application/DTOs/topicDTO';

const mockTopicCommandHandler: jest.Mocked<ITopicCommandHandler> = {
  createTopic: jest.fn(),
  updateTopic: jest.fn(),
  deleteTopic: jest.fn(),
} as any;

const mockTopicQueryHandler: jest.Mocked<ITopicQueryHandler> = {
  getAllTopics: jest.fn(),
  getTopicById: jest.fn(),
  getTopicTree: jest.fn(),
  findShortestPath: jest.fn(),
} as any;

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('TopicController', () => {
  let topicController: TopicController;

  beforeEach(() => {
    jest.clearAllMocks();
    topicController = new TopicController(mockTopicCommandHandler, mockTopicQueryHandler);
  });

  describe('createTopic', () => {
    it('should return 201 when topic is created successfully', async () => {
      // Arrange
      const createTopicDTO: CreatedTopicRequestDTO = {
        name: 'New Topic',
        content: 'New Topic Content',
        parentTopicId: 'parent-id',
      };
      const userId = 'user-id-123';
      const req = { body: createTopicDTO, user: { id: userId } } as any;
      const res = mockResponse();

      // Act
      await topicController.createTopic(req, res);

      // Assert
      expect(mockTopicCommandHandler.createTopic).toHaveBeenCalledWith({ ...createTopicDTO, createdBy: userId });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Topic created successfully' });
    });

    it('should return 500 when an error occurs', async () => {
      // Arrange
      const errorMessage = 'Error creating topic';
      mockTopicCommandHandler.createTopic.mockRejectedValueOnce(new Error(errorMessage));
      const req = { body: {} } as Request;
      const res = mockResponse();

      // Act
      await topicController.createTopic(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('updateTopic', () => {
    it('should return 200 when topic is updated successfully', async () => {
      // Arrange
      const topicId = 'topic-id';
      const updateTopicDTO: UpdateTopicRequestDTO = {
        name: 'Updated Topic',
        content: 'Updated Content',
      };
      const req = { 
        params: { id: topicId },
        body: updateTopicDTO
      } as any;
      const res = mockResponse();

      // Act
      await topicController.updateTopic(req, res);

      // Assert
      expect(mockTopicCommandHandler.updateTopic).toHaveBeenCalledWith(topicId, updateTopicDTO);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Topic updated successfully' });
    });

    it('should return 500 when an error occurs', async () => {
      // Arrange
      const topicId = 'topic-id';
      const errorMessage = 'Error updating topic';
      mockTopicCommandHandler.updateTopic.mockRejectedValueOnce(new Error(errorMessage));
      const req = { 
        params: { id: topicId },
        body: {}
      } as any;
      const res = mockResponse();

      // Act
      await topicController.updateTopic(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getTopicById', () => {
    it('should return 200 with topic when found', async () => {
      // Arrange
      const topicId = 'topic-id';
      const topicDTO: TopicDTO = {
        id: topicId,
        name: 'Test Topic',
        content: 'Test Content',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        parentTopicId: undefined
      };
      
      mockTopicQueryHandler.getTopicById.mockResolvedValueOnce(topicDTO);
      const req = { params: { id: topicId } } as any;
      const res = mockResponse();

      // Act
      await topicController.getTopicById(req, res);

      // Assert
      expect(mockTopicQueryHandler.getTopicById).toHaveBeenCalledWith(topicId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(topicDTO);
    });

    it('should return 404 when topic is not found', async () => {
      // Arrange
      const topicId = 'non-existent-id';
      mockTopicQueryHandler.getTopicById.mockResolvedValueOnce(null);
      const req = { params: { id: topicId } } as any;
      const res = mockResponse();

      // Act
      await topicController.getTopicById(req, res);

      // Assert
      expect(mockTopicQueryHandler.getTopicById).toHaveBeenCalledWith(topicId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Topic not found' });
    });

    it('should return 500 when an error occurs', async () => {
      // Arrange
      const topicId = 'topic-id';
      const errorMessage = 'Error fetching topic';
      mockTopicQueryHandler.getTopicById.mockRejectedValueOnce(new Error(errorMessage));
      const req = { params: { id: topicId } } as any;
      const res = mockResponse();

      // Act
      await topicController.getTopicById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getAllTopics', () => {
    it('should return 200 with paginated topics', async () => {
      // Arrange
      const limit = 10;
      const offset = 0;
      const orderBy = 'createdAt';
      const orderDirection = 'DESC';
      
      const topicsResponse = {
        topics: [
          {
            id: 'topic-1',
            name: 'Topic 1',
            content: 'Content 1',
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1
          }
        ],
        total: 1,
        limit,
        offset
      };
      
      mockTopicQueryHandler.getAllTopics.mockResolvedValueOnce(topicsResponse);
      const req = { 
        query: {
          limit: limit.toString(),
          offset: offset.toString(),
          orderBy,
          orderDirection
        }
      } as any;
      const res = mockResponse();

      // Act
      await topicController.getAllTopics(req, res);

      // Assert
      expect(mockTopicQueryHandler.getAllTopics).toHaveBeenCalledWith(
        limit, offset, orderBy, orderDirection
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(topicsResponse);
    });

    it('should use default values when query params are not provided', async () => {
      // Arrange
      const defaultLimit = 10;
      const defaultOffset = 0;
      const defaultOrderBy = 'createdAt';
      const defaultOrderDirection = 'ASC';
      
      const topicsResponse = {
        topics: [],
        total: 0,
        limit: defaultLimit,
        offset: defaultOffset
      };
      
      mockTopicQueryHandler.getAllTopics.mockResolvedValueOnce(topicsResponse);
      const req = { query: {} } as any;
      const res = mockResponse();

      // Act
      await topicController.getAllTopics(req, res);

      // Assert
      expect(mockTopicQueryHandler.getAllTopics).toHaveBeenCalledWith(
        defaultLimit, defaultOffset, defaultOrderBy, defaultOrderDirection
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(topicsResponse);
    });
  });
});
