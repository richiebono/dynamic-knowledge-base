import 'reflect-metadata';
import { ResourceRoutes } from '@resource/infrastructure/routes/resourceRoutes';
import { ResourceController } from '@resource/infrastructure/controllers/resourceController';
import { ResourceValidationMiddleware } from '@resource/infrastructure/middleware/resourceValidation';
import { instance, mock } from 'ts-mockito';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

// Define o mock router como um objeto com os métodos necessários
const mockRouter = {
  post: jest.fn().mockReturnThis(),
  put: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
};

// Garantir que routerInstance seja sempre o mockRouter
const routerInstance = mockRouter;

// Mock do Express Router para retornar sempre a mesma instância
jest.mock('express', () => ({
  Router: jest.fn(() => routerInstance)
}));

const mockCheckPermissions = jest.fn().mockReturnValue(jest.fn());
jest.mock('@shared/infrastructure/middleware/authMiddleware', () => ({
  AuthMiddleware: jest.fn().mockImplementation(() => ({
    checkPermissions: mockCheckPermissions
  }))
}));

describe('ResourceRoutes', () => {
  let resourceController: ResourceController;
  let resourceValidationMiddleware: ResourceValidationMiddleware;
  let resourceRoutes: ResourceRoutes;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    resourceController = mock<ResourceController>();
    resourceValidationMiddleware = mock<ResourceValidationMiddleware>();
    
    // Criar uma nova instância de ResourceRoutes que usará o mockRouter
    resourceRoutes = new ResourceRoutes(
      instance(resourceController),
      instance(resourceValidationMiddleware)
    );
  });
  
  it('should initialize all routes', () => {
    expect(mockRouter.post).toHaveBeenCalledTimes(1);
    expect(mockRouter.put).toHaveBeenCalledTimes(1);
    expect(mockRouter.get).toHaveBeenCalledTimes(3);
    expect(mockRouter.delete).toHaveBeenCalledTimes(1);
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
    // Utilizando toEqual em vez de toBe para comparar estrutura em vez de referência
    expect(returnedRouter).toEqual(routerInstance);
  });
});
