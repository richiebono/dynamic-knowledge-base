import 'reflect-metadata';
import { ResourceValidationMiddleware } from '@resource/infrastructure/middleware/resourceValidation';
import { Request, Response, NextFunction } from 'express';
import { mock, instance, verify, when, capture, anything } from 'ts-mockito';
import { ResourceType } from '@resource/domain/enum/resourceType';

describe('ResourceValidationMiddleware', () => {
  let middleware: ResourceValidationMiddleware;
  let req: Request;
  let res: Response;
  let next: jest.Mock;
  
  beforeEach(() => {
    middleware = new ResourceValidationMiddleware();
    req = mock<Request>();
    res = mock<Response>();
    next = jest.fn();
    
    when(res.status(anything())).thenReturn(instance(res));
    when(res.json(anything())).thenReturn(instance(res));
  });
  
  describe('validateCreateResource', () => {
    it('should call next() when request body is valid', () => {
      // Arrange
      const validBody = {
        url: 'http://example.com',
        description: 'Test resource',
        type: ResourceType.ARTICLE,
        topicId: 1,
      };
      
      when(req.body).thenReturn(validBody);
      
      middleware.validateCreateResource(instance(req), instance(res), next);
      
      expect(next).toHaveBeenCalled();
      verify(res.status(anything())).never();
    });
    
    it('should return 400 when url is missing', () => {
      // Arrange
      const invalidBody = {
        description: 'Test resource',
        type: ResourceType.ARTICLE,
        topicId: 1,
      };
      
      when(req.body).thenReturn(invalidBody);
      
      // Act
      middleware.validateCreateResource(instance(req), instance(res), next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
    });
    
    it('should return 400 when url is not a valid URI', () => {
      // Arrange
      const invalidBody = {
        url: 'invalid-url',
        description: 'Test resource',
        type: ResourceType.ARTICLE,
        topicId: 1,
      };
      
      when(req.body).thenReturn(invalidBody);
      
      // Act
      middleware.validateCreateResource(instance(req), instance(res), next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
    });
    
    it('should return 400 when description is missing', () => {
      // Arrange
      const invalidBody = {
        url: 'http://example.com',
        type: ResourceType.ARTICLE,
        topicId: 1,
      };
      
      when(req.body).thenReturn(invalidBody);
      
      // Act
      middleware.validateCreateResource(instance(req), instance(res), next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
    });
    
    it('should return 400 when type is invalid', () => {
      // Arrange
      const invalidBody = {
        url: 'http://example.com',
        description: 'Test resource',
        type: 'invalid-type',
        topicId: 1,
      };
      
      when(req.body).thenReturn(invalidBody);
      
      // Act
      middleware.validateCreateResource(instance(req), instance(res), next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
    });
    
    it('should return 400 when topicId is not a number', () => {
      // Arrange
      const invalidBody = {
        url: 'http://example.com',
        description: 'Test resource',
        type: ResourceType.ARTICLE,
        topicId: 'not-a-number',
      };
      
      when(req.body).thenReturn(invalidBody);
      
      // Act
      middleware.validateCreateResource(instance(req), instance(res), next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
    });
  });
  
  describe('validateUpdateResource', () => {
    it('should call next() when request body is valid', () => {
      // Arrange
      const validBody = {
        url: 'http://example.com',
        description: 'Updated resource',
        type: ResourceType.VIDEO,
      };
      
      when(req.body).thenReturn(validBody);
      
      // Act
      middleware.validateUpdateResource(instance(req), instance(res), next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      verify(res.status(anything())).never();
    });
    
    it('should call next() when request body is empty (no fields to update)', () => {
      // Arrange
      when(req.body).thenReturn({});
      
      // Act
      middleware.validateUpdateResource(instance(req), instance(res), next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      verify(res.status(anything())).never();
    });
    
    it('should return 400 when url is not a valid URI', () => {
      // Arrange
      const invalidBody = {
        url: 'invalid-url',
      };
      
      when(req.body).thenReturn(invalidBody);
      
      // Act
      middleware.validateUpdateResource(instance(req), instance(res), next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
    });
    
    it('should return 400 when type is invalid', () => {
      // Arrange
      const invalidBody = {
        type: 'invalid-type',
      };
      
      when(req.body).thenReturn(invalidBody);
      
      // Act
      middleware.validateUpdateResource(instance(req), instance(res), next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
    });
  });
});
