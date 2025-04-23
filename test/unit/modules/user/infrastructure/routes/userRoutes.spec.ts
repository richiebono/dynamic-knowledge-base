import 'reflect-metadata';
import { UserController } from '@user/infrastructure/controllers/userController';
import { UserValidationMiddleware } from '@user/infrastructure/middleware/userValidation';
import { UserRoutes } from '@user/infrastructure/routes/userRoutes';
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

describe('UserRoutes', () => {
  let userController: UserController;
  let validationMiddleware: UserValidationMiddleware;
  let userRoutes: UserRoutes;
  let mockRouter: any;
  
  beforeEach(() => {
    userController = mock(UserController);
    validationMiddleware = mock(UserValidationMiddleware);
    
    jest.clearAllMocks();
    
    userRoutes = new UserRoutes(
      instance(userController),
      instance(validationMiddleware)
    );
    
    mockRouter = (Router as jest.Mock)();
  });
  
  it('should initialize routes', () => {
    expect(Router).toHaveBeenCalled();
    expect(mockRouter.post).toHaveBeenCalledTimes(2);
    expect(mockRouter.put).toHaveBeenCalled();
    expect(mockRouter.get).toHaveBeenCalledTimes(2);
  });
  
  // Comment this out if you don't mind to create user without Admin role
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
  
  it('should set up GET /:id route with viewer permissions', () => {
    // Assert
    const authMiddleware = new AuthMiddleware();
    expect(authMiddleware.checkPermissions).toHaveBeenCalledWith(UserRoleEnum.Viewer);
    
    expect(mockRouter.get).toHaveBeenCalledWith(
      '/:id',
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('should set up GET / route with admin permissions', () => {
    // Assert
    const authMiddleware = new AuthMiddleware();
    expect(authMiddleware.checkPermissions).toHaveBeenCalledWith(UserRoleEnum.Admin);
    
    expect(mockRouter.get).toHaveBeenCalledWith(
      '/',
      expect.any(Function),
      expect.any(Function)
    );
  });
  
  it('should set up login route without auth middleware', () => {
    // Assert
    expect(mockRouter.post).toHaveBeenCalledWith(
      '/login',
      expect.any(Function)
    );
  });
  
  it('should expose router via getRouter method', () => {
    // Act
    const router = userRoutes.getRouter();
    
    // Assert
    expect(router).toBe(mockRouter);
  });
});
