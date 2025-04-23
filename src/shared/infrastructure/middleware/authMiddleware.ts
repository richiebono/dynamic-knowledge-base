import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRoleEnum } from '@shared/domain/enum/userRole';
import { ENV } from '@shared/infrastructure/config/env';

declare global {
  namespace Express {
    interface Request {
      user: { id: string; role: UserRoleEnum } | null;
    }
  }
}

export class AuthMiddleware {
  validateToken(req: Request, res: Response, next: NextFunction) {
    const publicEndpoints = [
      { path: '/api/users', method: 'POST' },      
      { path: '/api/users/login', method: 'POST' } 
    ];

    const isPublicRoute = publicEndpoints.some(endpoint => 
      req.originalUrl === endpoint.path && req.method === endpoint.method
    );

    if (isPublicRoute) {
      console.log('Public route detected:', req.method, req.originalUrl);
      return next();
    }

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, ENV.JWT.SECRET as string, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }

      req.user = decoded as { id: string; role: UserRoleEnum };
      next();
    });
  }

  checkPermissions(requiredRole: UserRoleEnum) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }
      next();
    };
  }
}