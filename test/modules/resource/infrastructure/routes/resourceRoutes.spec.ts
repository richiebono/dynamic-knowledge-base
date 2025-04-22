import 'reflect-metadata';
import { ResourceRoutes } from '@resource/infrastructure/routes/resourceRoutes';
import { ResourceController } from '@resource/infrastructure/controllers/resourceController';
import { ResourceValidationMiddleware } from '@resource/infrastructure/middleware/resourceValidation';
import { Router } from 'express';
import { mock, instance, verify, when, capture } from 'ts-mockito';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

// Mock for express Router
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

// Improved mock for AuthMiddleware
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
    
    // Reset mocks
    jest.clearAllMocks();
    router = Router();
    
    // Create routes (this will call initializeRoutes and setup auth middleware)
    resourceRoutes = new ResourceRoutes(
      instance(resourceController),
      instance(resourceValidationMiddleware)
    );
  });
  
  it('should initialize all routes', () => {
    // Verify each router method was called the correct number of times
    expect(router.post).toHaveBeenCalledTimes(1);
    expect(router.put).toHaveBeenCalledTimes(1);
    expect(router.get).toHaveBeenCalledTimes(3); // get resource, get by topic ID, get all
    expect(router.delete).toHaveBeenCalledTimes(1);
  });
  
  it('should apply authentication middleware with proper roles', () => {
    // Check that checkPermissions was called 6 times total (once for each route)
    expect(mockCheckPermissions).toHaveBeenCalledTimes(6);
    
    // Verify that checkPermissions was called with Admin role for admin-required routes
    expect(mockCheckPermissions).toHaveBeenCalledWith(UserRoleEnum.Admin);
    expect(mockCheckPermissions).toHaveBeenCalledWith(UserRoleEnum.Viewer);
    
    // More specific assertions to verify the correct role for each route
    const calls = mockCheckPermissions.mock.calls;
    
    // Admin routes: POST, PUT, DELETE
    expect(calls.some(call => call[0] === UserRoleEnum.Admin)).toBeTruthy();
    
    // Viewer routes: GET
    expect(calls.some(call => call[0] === UserRoleEnum.Viewer)).toBeTruthy();
    
    // Count role occurrences (should be 3 Admin, 3 Viewer based on resourceRoutes.ts)
    const adminCalls = calls.filter(call => call[0] === UserRoleEnum.Admin).length;
    const viewerCalls = calls.filter(call => call[0] === UserRoleEnum.Viewer).length;
    
    expect(adminCalls).toBe(3); // POST, PUT, DELETE
    expect(viewerCalls).toBe(3); // GET single, GET by topic, GET all
  });
  
  it('should return router instance when getRouter is called', () => {
    const returnedRouter = resourceRoutes.getRouter();
    expect(returnedRouter).toBe(router);
  });
});
