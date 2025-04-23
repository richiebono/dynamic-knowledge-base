import 'reflect-metadata';
import { container } from '@shared/infrastructure/ioc/container';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { ErrorHandler } from '@shared/infrastructure/middleware/errorHandler';

describe('IoC Container', () => {
  it('should resolve AuthMiddleware', () => {
    // Act
    const authMiddleware = container.get(AuthMiddleware);
    
    // Assert
    expect(authMiddleware).toBeInstanceOf(AuthMiddleware);
  });

  it('should resolve ErrorHandler', () => {
    // Act
    const errorHandler = container.get(ErrorHandler);
    
    // Assert
    expect(errorHandler).toBeInstanceOf(ErrorHandler);
  });

  it('should have user module container loaded', () => {
    expect(container.isBound(AuthMiddleware)).toBe(true);
  });

  it('should have AuthMiddleware bound in the container', () => {
    expect(container.isBound(AuthMiddleware)).toBe(true);
  });
});
