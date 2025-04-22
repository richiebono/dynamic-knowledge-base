import 'reflect-metadata';
import { TopicController } from '@topic/infrastructure/controllers/topicController';
import { TopicValidationMiddleware } from '@topic/infrastructure/middleware/topicValidation';
import { TopicRoutes } from '@topic/infrastructure/routes/topicRoutes';
import { Router } from 'express';
import { mock, instance, verify, when } from 'ts-mockito';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

jest.mock('express', () => {
  const mockRouter = {
    get: jest.fn().mockReturnThis(),
    post: jest.fn().mockReturnThis(),
    put: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis()
  };
  
  return {
    Router: jest.fn(() => mockRouter)
  };
});

jest.mock('@shared/infrastructure/middleware/authMiddleware', () => {
  const mockCheckPermissions = jest.fn(() => jest.fn());
  
  return {
    AuthMiddleware: jest.fn().mockImplementation(() => {
      return {
        checkPermissions: mockCheckPermissions
      };
    })
  };
});

describe('TopicRoutes', () => {
  let topicController: TopicController;
  let validationMiddleware: TopicValidationMiddleware;
  let topicRoutes: TopicRoutes;
  let mockRouter: any;
  
  beforeEach(() => {
    topicController = mock(TopicController);
    validationMiddleware = mock(TopicValidationMiddleware);
    
    jest.clearAllMocks();
    
    topicRoutes = new TopicRoutes(
      instance(topicController),
      instance(validationMiddleware)
    );
    
    mockRouter = (Router as jest.Mock)();
  });
  
  it('should initialize routes', () => {
    expect(Router).toHaveBeenCalled();
    expect(mockRouter.post).toHaveBeenCalled();
    expect(mockRouter.put).toHaveBeenCalled();
    expect(mockRouter.get).toHaveBeenCalledTimes(4);
  });
  
  it('should set up POST / route with admin permissions', () => {
    // Assert
    const authMiddleware = new AuthMiddleware();
    expect(authMiddleware.checkPermissions).toHaveBeenCalledWith(UserRoleEnum.Admin);
    expect(mockRouter.post).toHaveBeenCalledWith(
      '/',
      expect.any(Function), 
      expect.any(Function), 
      expect.any(Function)  
    );
  });
  
  it('should set up GET / route with viewer permissions', () => {
    // Assert
    const authMiddleware = new AuthMiddleware();
    expect(authMiddleware.checkPermissions).toHaveBeenCalledWith(UserRoleEnum.Viewer);
    
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
