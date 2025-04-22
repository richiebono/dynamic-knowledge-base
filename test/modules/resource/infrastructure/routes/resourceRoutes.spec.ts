import 'reflect-metadata';
import { ResourceRoutes } from '@resource/infrastructure/routes/resourceRoutes';
import { ResourceController } from '@resource/infrastructure/controllers/resourceController';
import { ResourceValidationMiddleware } from '@resource/infrastructure/middleware/resourceValidation';
import { Router } from 'express';
import { mock, instance, verify, when, capture } from 'ts-mockito';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

jest.mock('express', () => {
  const mockRouter = {
    post: jest.fn().mockReturnThis(),
    put: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };
  return {
    Router: jest.fn(() => mockRouter),
  };
});

const mockCheckPermissions = jest.fn().mockReturnValue(jest.fn());
jest.mock('@shared/infrastructure/middleware/authMiddleware', () => {
  return {
    AuthMiddleware: jest.fn().mockImplementation(() => ({
      checkPermissions: mockCheckPermissions
    })),
  };
});

describe('ResourceRoutes', () => {
  let resourceController: ResourceController;
  let resourceValidationMiddleware: ResourceValidationMiddleware;
  let router: Router;
  let resourceRoutes: ResourceRoutes;
  
  beforeEach(() => {
    resourceController = mock<ResourceController>();
    resourceValidationMiddleware = mock<ResourceValidationMiddleware>();
    
    jest.clearAllMocks();
    router = Router();
    
    resourceRoutes = new ResourceRoutes(
      instance(resourceController),
      instance(resourceValidationMiddleware)
    );
  });
  
  it('should initialize all routes', () => {
    expect(router.post).toHaveBeenCalledTimes(1);
    expect(router.put).toHaveBeenCalledTimes(1);
    expect(router.get).toHaveBeenCalledTimes(3);
    expect(router.delete).toHaveBeenCalledTimes(1);
  });
  
  it('should apply authentication middleware with proper roles', () => {
    expect(mockCheckPermissions).toHaveBeenCalledTimes(6);
    expect(mockCheckPermissions).toHaveBeenCalledWith(UserRoleEnum.Admin);
    expect(mockCheckPermissions).toHaveBeenCalledWith(UserRoleEnum.Viewer);
    
    const calls = mockCheckPermissions.mock.calls;
    
    expect(calls.some(call => call[0] === UserRoleEnum.Admin)).toBeTruthy();   
    expect(calls.some(call => call[0] === UserRoleEnum.Viewer)).toBeTruthy();
    
    const adminCalls = calls.filter(call => call[0] === UserRoleEnum.Admin).length;
    const viewerCalls = calls.filter(call => call[0] === UserRoleEnum.Viewer).length;
    
    expect(adminCalls).toBe(3); 
    expect(viewerCalls).toBe(3);
  });
  
  it('should return router instance when getRouter is called', () => {
    const returnedRouter = resourceRoutes.getRouter();
    expect(returnedRouter).toBe(router);
  });
});
