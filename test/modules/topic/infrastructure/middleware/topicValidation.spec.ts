import 'reflect-metadata';
import { TopicValidationMiddleware } from '@topic/infrastructure/middleware/topicValidation';
import { Request, Response, NextFunction } from 'express';
import { mock, instance, verify, capture, when, anything } from 'ts-mockito';

describe('TopicValidationMiddleware', () => {
  let topicValidationMiddleware: TopicValidationMiddleware;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    topicValidationMiddleware = new TopicValidationMiddleware();
    req = mock<Request>();
    res = mock<Response>();
    next = jest.fn();

    // Fix method chaining by using instance(res) instead of res
    when(res.status(anything())).thenReturn(instance(res));
    when(res.json(anything())).thenReturn(instance(res) as any);
  });

  describe('validateCreateTopic', () => {
    it('should call next() when input is valid', () => {
      // Arrange
      const validBody = {
        name: 'Valid Topic Name',
        content: 'Valid content for the topic'
      };
      when(req.body).thenReturn(validBody);

      // Act
      topicValidationMiddleware.validateCreateTopic(instance(req), instance(res), next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 when name is missing', () => {
      // Arrange
      const invalidBody = {
        content: 'Content without a name'
      };
      when(req.body).thenReturn(invalidBody);

      // Act
      topicValidationMiddleware.validateCreateTopic(instance(req), instance(res), next);

      // Assert
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
      const [jsonArg] = capture(res.json).last();
      expect(jsonArg.errors).toContainEqual(expect.stringContaining('Name is required'));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when content is missing', () => {
      // Arrange
      const invalidBody = {
        name: 'Topic without content'
      };
      when(req.body).thenReturn(invalidBody);

      // Act
      topicValidationMiddleware.validateCreateTopic(instance(req), instance(res), next);

      // Assert
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
      const [jsonArg] = capture(res.json).last();
      expect(jsonArg.errors).toContainEqual(expect.stringContaining('Content is required'));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when parentTopicId is not an integer', () => {
      // Arrange
      const invalidBody = {
        name: 'Valid Topic Name',
        content: 'Valid content',
        parentTopicId: 'not-an-integer'
      };
      when(req.body).thenReturn(invalidBody);

      // Act
      topicValidationMiddleware.validateCreateTopic(instance(req), instance(res), next);

      // Assert
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
      const [jsonArg] = capture(res.json).last();
      expect(jsonArg.errors).toContainEqual(expect.stringContaining('Parent Topic ID must be an integer'));
    });
  });

  describe('validateUpdateTopic', () => {
    it('should call next() when input is valid', () => {
      // Arrange
      const validBody = {
        name: 'Updated Topic Name',
        content: 'Updated content'
      };
      when(req.body).thenReturn(validBody);

      // Act
      topicValidationMiddleware.validateUpdateTopic(instance(req), instance(res), next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it('should call next() when input is partially provided', () => {
      // Arrange
      const validBody = {
        name: 'Only name is updated'
      };
      when(req.body).thenReturn(validBody);

      // Act
      topicValidationMiddleware.validateUpdateTopic(instance(req), instance(res), next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 when parentTopicId is not an integer', () => {
      // Arrange
      const invalidBody = {
        name: 'Valid name',
        parentTopicId: 'not-an-integer'
      };
      when(req.body).thenReturn(invalidBody);

      // Act
      topicValidationMiddleware.validateUpdateTopic(instance(req), instance(res), next);

      // Assert
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
      const [jsonArg] = capture(res.json).last();
      expect(jsonArg.errors).toContainEqual(expect.stringContaining('Parent Topic ID must be an integer'));
    });
  });
});
