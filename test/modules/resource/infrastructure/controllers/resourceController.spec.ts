import 'reflect-metadata';
import { ResourceController } from '@resource/infrastructure/controllers/resourceController';
import { IResourceCommandHandler } from '@resource/application/interfaces/resourceCommandHandler';
import { IResourceQueryHandler } from '@resource/application/interfaces/resourceQueryHandler';
import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';
import { Request, Response } from 'express';

const mockResourceCommandHandler: jest.Mocked<IResourceCommandHandler> = {
  createResource: jest.fn(),
  updateResource: jest.fn(),
  deleteResource: jest.fn(),
} as any;

const mockResourceQueryHandler: jest.Mocked<IResourceQueryHandler> = {
  getResourceById: jest.fn(),
  getResourcesByTopicId: jest.fn(),
  getAllResources: jest.fn(),
} as any;

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('ResourceController', () => {
  let controller: ResourceController;
  
  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ResourceController(
      mockResourceCommandHandler,
      mockResourceQueryHandler
    );
  });
  
  describe('createResource', () => {
    it('should return 201 when resource is created successfully', async () => {
      // Arrange
      const resourceDTO: ResourceDTO = {
        id: 'resource-id',
        topicId: 'topic-id',
        url: 'http://example.com',
        description: 'Test resource',
        type: 'article',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const req = { body: resourceDTO } as Request;
      const res = mockResponse();
      
      // Act
      await controller.createResource(req, res);
      
      // Assert
      expect(mockResourceCommandHandler.createResource).toHaveBeenCalledWith(resourceDTO);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Resource created successfully' });
    });
    
    it('should return 500 when an error occurs', async () => {
      // Arrange
      const errorMessage = 'Test error';
      mockResourceCommandHandler.createResource.mockRejectedValueOnce(new Error(errorMessage));
      
      const req = { body: {} } as Request;
      const res = mockResponse();
      
      // Act
      await controller.createResource(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
  
  describe('updateResource', () => {
    it('should return 200 when resource is updated successfully', async () => {
      // Arrange
      const resourceId = 'resource-id';
      const resourceDTO: ResourceDTO = {
        id: resourceId,
        topicId: 'topic-id',
        url: 'http://updated-example.com',
        description: 'Updated resource',
        type: 'video',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const req = { 
        params: { id: resourceId },
        body: resourceDTO 
      } as any;
      const res = mockResponse();
      
      // Act
      await controller.updateResource(req, res);
      
      // Assert
      expect(mockResourceCommandHandler.updateResource).toHaveBeenCalledWith(resourceId, resourceDTO);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Resource updated successfully' });
    });
    
    it('should return 500 when an error occurs', async () => {
      // Arrange
      const resourceId = 'resource-id';
      const errorMessage = 'Test error';
      
      mockResourceCommandHandler.updateResource.mockRejectedValueOnce(new Error(errorMessage));
      
      const req = { 
        params: { id: resourceId },
        body: {}
      } as any;
      const res = mockResponse();
      
      // Act
      await controller.updateResource(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
  
  describe('getResource', () => {
    it('should return 200 with resource when found', async () => {
      // Arrange
      const resourceId = 'resource-id';
      const resourceDTO: ResourceDTO = {
        id: resourceId,
        topicId: 'topic-id',
        url: 'http://example.com',
        description: 'Test resource',
        type: 'article',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockResourceQueryHandler.getResourceById.mockResolvedValueOnce(resourceDTO);
      
      const req = { params: { id: resourceId } } as any;
      const res = mockResponse();
      
      // Act
      await controller.getResource(req, res);
      
      // Assert
      expect(mockResourceQueryHandler.getResourceById).toHaveBeenCalledWith(resourceId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(resourceDTO);
    });
    
    it('should return 404 when resource is not found', async () => {
      // Arrange
      const resourceId = 'non-existent-id';
      
      mockResourceQueryHandler.getResourceById.mockResolvedValueOnce(null);
      
      const req = { params: { id: resourceId } } as any;
      const res = mockResponse();
      
      // Act
      await controller.getResource(req, res);
      
      // Assert
      expect(mockResourceQueryHandler.getResourceById).toHaveBeenCalledWith(resourceId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Resource not found' });
    });
    
    it('should return 500 when an error occurs', async () => {
      // Arrange
      const resourceId = 'resource-id';
      const errorMessage = 'Test error';
      
      mockResourceQueryHandler.getResourceById.mockRejectedValueOnce(new Error(errorMessage));
      
      const req = { params: { id: resourceId } } as any;
      const res = mockResponse();
      
      // Act
      await controller.getResource(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
  
  describe('getResourcesByTopicId', () => {
    it('should return 200 with resources for a topic', async () => {
      // Arrange
      const topicId = 'topic-id';
      const resources: ResourceDTO[] = [
        {
          id: 'resource-1',
          topicId,
          url: 'http://example1.com',
          description: 'Resource 1',
          type: 'article',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'resource-2',
          topicId,
          url: 'http://example2.com',
          description: 'Resource 2',
          type: 'video',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      mockResourceQueryHandler.getResourcesByTopicId.mockResolvedValueOnce(resources);
      
      const req = { params: { topicId } } as any;
      const res = mockResponse();
      
      // Act
      await controller.getResourcesByTopicId(req, res);
      
      // Assert
      expect(mockResourceQueryHandler.getResourcesByTopicId).toHaveBeenCalledWith(topicId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(resources);
    });
    
    it('should return 500 when an error occurs', async () => {
      // Arrange
      const topicId = 'topic-id';
      const errorMessage = 'Test error';
      
      mockResourceQueryHandler.getResourcesByTopicId.mockRejectedValueOnce(new Error(errorMessage));
      
      const req = { params: { topicId } } as any;
      const res = mockResponse();
      
      // Act
      await controller.getResourcesByTopicId(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
  
  describe('getAllResources', () => {
    it('should return 200 with paginated resources', async () => {
      // Arrange
      const limit = 10;
      const offset = 0;
      const orderBy = 'createdAt';
      const orderDirection = 'asc';
      
      const paginatedResult = {
        resources: [
          {
            id: 'resource-1',
            topicId: 'topic-1',
            url: 'http://example1.com',
            description: 'Resource 1',
            type: 'article',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
        limit,
        offset,
      };
      
      mockResourceQueryHandler.getAllResources.mockResolvedValueOnce(paginatedResult);
      
      const req = { 
        query: {
          limit: limit.toString(),
          offset: offset.toString(),
          orderBy,
          orderDirection,
        }
      } as any;
      const res = mockResponse();
      
      // Act
      await controller.getAllResources(req, res);
      
      // Assert
      expect(mockResourceQueryHandler.getAllResources).toHaveBeenCalledWith(limit, offset, orderBy, orderDirection);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(paginatedResult);
    });
    
    it('should return 500 when an error occurs', async () => {
      // Arrange
      const errorMessage = 'Test error';
      
      mockResourceQueryHandler.getAllResources.mockRejectedValueOnce(new Error(errorMessage));
      
      const req = { query: {} } as any;
      const res = mockResponse();
      
      // Act
      await controller.getAllResources(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
  
  describe('deleteResource', () => {
    it('should return 204 when resource is deleted successfully', async () => {
      // Arrange
      const resourceId = 'resource-id';
      
      const req = { params: { id: resourceId } } as any;
      const res = mockResponse();
      
      // Act
      await controller.deleteResource(req, res);
      
      // Assert
      expect(mockResourceCommandHandler.deleteResource).toHaveBeenCalledWith(resourceId);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
    
    it('should return 500 when an error occurs', async () => {
      // Arrange
      const resourceId = 'resource-id';
      const errorMessage = 'Test error';
      
      mockResourceCommandHandler.deleteResource.mockRejectedValueOnce(new Error(errorMessage));
      
      const req = { params: { id: resourceId } } as any;
      const res = mockResponse();
      
      // Act
      await controller.deleteResource(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
