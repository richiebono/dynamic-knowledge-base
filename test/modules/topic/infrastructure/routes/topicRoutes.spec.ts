import 'reflect-metadata';
import { TopicController } from '@topic/infrastructure/controllers/topicController';
import { TopicValidationMiddleware } from '@topic/infrastructure/middleware/topicValidation';
import { TopicRoutes } from '@topic/infrastructure/routes/topicRoutes';
import { Router } from 'express';
import { mock, instance, verify, when } from 'ts-mockito';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

const mockRouter = {
  get: jest.fn().mockReturnThis(),
  post: jest.fn().mockReturnThis(),
  put: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis()
};

jest.mock('express', () => ({
  Router: jest.fn(() => mockRouter)
}));

const mockCheckPermissions = jest.fn(() => jest.fn());

jest.mock('@shared/infrastructure/middleware/authMiddleware', () => ({
  AuthMiddleware: jest.fn().mockImplementation(() => ({
    checkPermissions: mockCheckPermissions
  }))
}));

describe('TopicRoutes', () => {
  let topicController: TopicController;
  let validationMiddleware: TopicValidationMiddleware;
  let topicRoutes: TopicRoutes;
  
  beforeEach(() => {
    topicController = mock(TopicController);
    validationMiddleware = mock(TopicValidationMiddleware);
    
    jest.clearAllMocks();
    
    topicRoutes = new TopicRoutes(
      instance(topicController),
      instance(validationMiddleware)
    );
  });
  
  it('should initialize routes', () => {
    expect(Router).toHaveBeenCalled();
    expect(mockRouter.post).toHaveBeenCalled();
    expect(mockRouter.put).toHaveBeenCalled();
    expect(mockRouter.get).toHaveBeenCalledTimes(4);
  });
  
  it('should set up POST / route with admin permissions', () => {
    // Assert
    expect(mockCheckPermissions).toHaveBeenCalledWith(UserRoleEnum.Admin);
    expect(mockRouter.post).toHaveBeenCalledWith(
      '/',
      expect.any(Function), 
      expect.any(Function), 
      expect.any(Function)  
    );
  });
  
  it('should set up GET / route with viewer permissions', () => {
    // Assert
    expect(mockCheckPermissions).toHaveBeenCalledWith(UserRoleEnum.Viewer);
    
    expect(mockRouter.get).toHaveBeenCalledWith(
      '/',
      expect.any(Function),
      expect.any(Function)
    );
  });
  
  it('should expose router via getRouter method', () => {
    // Act
    const router = topicRoutes.getRouter();
    
    // Assert
    expect(router).toBe(mockRouter);
  });
});
