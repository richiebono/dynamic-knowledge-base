import 'reflect-metadata';
import { UserValidationMiddleware } from '@user/infrastructure/middleware/userValidation';
import { Request, Response, NextFunction } from 'express';
import { mock, instance, verify, capture, when, anything } from 'ts-mockito';

describe('UserValidationMiddleware', () => {
  let userValidationMiddleware: UserValidationMiddleware;
  let req: Request;
  let reqInstance: Request;
  let res: Response;
  let resInstance: Response;
  let next: NextFunction;

  beforeEach(() => {
    userValidationMiddleware = new UserValidationMiddleware();
    req = mock<Request>();
    res = mock<Response>();
    reqInstance = instance(req);
    resInstance = instance(res);
    next = jest.fn();
    when(res.status(anything())).thenReturn(resInstance);
    when(res.json(anything())).thenReturn(resInstance as any);
  });

  describe('validateCreateUser', () => {
    it('should call next() when input is valid', () => {
      // Arrange
      const validBody = {
        name: 'Valid User',
        email: 'valid@example.com',
        password: 'password123',
        role: 'Admin'
      };
      when(req.body).thenReturn(validBody);

      // Act
      userValidationMiddleware.validateCreateUser(reqInstance, resInstance, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 when name is missing', () => {
      // Arrange
      const invalidBody = {
        email: 'valid@example.com',
        password: 'password123',  // Added password field
        role: 'Admin'
      };
      when(req.body).thenReturn(invalidBody);

      // Act
      userValidationMiddleware.validateCreateUser(reqInstance, resInstance, next);

      // Assert
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
      const [jsonArg] = capture(res.json).last();
      expect(jsonArg.errors).toContainEqual(expect.stringContaining('Name is required'));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when email is invalid', () => {
      // Arrange
      const invalidBody = {
        name: 'Valid User',
        email: 'not-an-email',
        password: 'password123',
        role: 'Admin'
      };
      when(req.body).thenReturn(invalidBody);

      // Act
      userValidationMiddleware.validateCreateUser(reqInstance, resInstance, next);

      // Assert
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
      const [jsonArg] = capture(res.json).last();
      expect(jsonArg.errors).toContainEqual(expect.stringContaining('Valid email is required'));
    });

    it('should return 400 when role is invalid', () => {
      // Arrange
      const invalidBody = {
        name: 'Valid User',
        email: 'valid@example.com',
        password: 'password123',
        role: 'InvalidRole'
      };
      when(req.body).thenReturn(invalidBody);

      // Act
      userValidationMiddleware.validateCreateUser(reqInstance, resInstance, next);

      // Assert
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
      const [jsonArg] = capture(res.json).last();
      expect(jsonArg.errors).toContainEqual(expect.stringContaining('Role must be Admin, Editor, Viewer, or Contributor'));
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateUpdateUser', () => {
    it('should call next() when input is valid', () => {
      // Arrange
      const validBody = {
        name: 'Updated User',
        email: 'updated@example.com',
        role: 'Editor'
      };
      when(req.body).thenReturn(validBody);

      // Act
      userValidationMiddleware.validateUpdateUser(reqInstance, resInstance, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it('should call next() when body is partially provided', () => {
      // Arrange
      const validBody = {
        name: 'Only name is updated'
      };
      when(req.body).thenReturn(validBody);

      // Act
      userValidationMiddleware.validateUpdateUser(reqInstance, resInstance, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 when email is invalid', () => {
      // Arrange
      const invalidBody = {
        email: 'not-an-email'
      };
      when(req.body).thenReturn(invalidBody);

      // Act
      userValidationMiddleware.validateUpdateUser(reqInstance, resInstance, next);

      // Assert
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
      const [jsonArg] = capture(res.json).last();
      expect(jsonArg.errors).toContainEqual(expect.stringContaining('email'));
    });

    it('should return 400 when role is invalid', () => {
      // Arrange
      const invalidBody = {
        role: 'InvalidRole'
      };
      when(req.body).thenReturn(invalidBody);

      // Act
      userValidationMiddleware.validateUpdateUser(reqInstance, resInstance, next);

      // Assert
      verify(res.status(400)).once();
      verify(res.json(anything())).once();
      const [jsonArg] = capture(res.json).last();
      expect(jsonArg.errors).toContainEqual(expect.stringContaining('Role must be Admin, Editor, Viewer, or Contributor'));
    });
  });
});
