import 'reflect-metadata';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { UserRoleEnum } from '@shared/domain/enum/userRole';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    authMiddleware = new AuthMiddleware();
    req = { headers: {}, path: '/api/protected' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('validateToken', () => {
    it('should call next() for public routes', () => {
      req = { ...req, path: '/api/users/login' };
      authMiddleware.validateToken(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', () => {
      req.headers = {};
      authMiddleware.validateToken(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', () => {
      req.headers = { authorization: 'Bearer invalidtoken' };
      (mockedJwt.verify as jest.Mock).mockImplementation((_token, _secret, cb) => cb(new Error('invalid'), undefined));
      authMiddleware.validateToken(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to authenticate token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should set req.user and call next() if token is valid', () => {
      req.headers = { authorization: 'Bearer validtoken' };
      const decoded = { id: '123', role: UserRoleEnum.Admin };
      (mockedJwt.verify as jest.Mock).mockImplementation((_token, _secret, cb) => cb(null, decoded));
      authMiddleware.validateToken(req as Request, res as Response, next);
      expect(req.user).toEqual(decoded);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('checkPermissions', () => {
    it('should call next() if user has required role', () => {
      const middleware = authMiddleware.checkPermissions(UserRoleEnum.Admin);
      req.user = { id: '1', role: UserRoleEnum.Admin };
      middleware(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user is missing or role is insufficient', () => {
      const middleware = authMiddleware.checkPermissions(UserRoleEnum.Admin);
      req.user = { id: '1', role: UserRoleEnum.Editor };
      middleware(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Insufficient permissions' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if req.user is null', () => {
      const middleware = authMiddleware.checkPermissions(UserRoleEnum.Admin);
      req.user = null;
      middleware(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Insufficient permissions' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
