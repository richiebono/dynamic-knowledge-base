import { ErrorHandler, CustomError } from '@shared/infrastructure/middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    errorHandler = new ErrorHandler();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
  });

  it('should handle error with custom statusCode', () => {
    // Arrange
    const customError: CustomError = new Error('Bad request');
    customError.statusCode = 400;
    
    // Act
    errorHandler.handle(customError, mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 400,
      message: 'Bad request'
    });
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should handle error with default statusCode when not provided', () => {
    // Arrange
    const error: CustomError = new Error('Something went wrong');
    
    // Act
    errorHandler.handle(error, mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 500,
      message: 'Something went wrong'
    });
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should handle error with default message when not provided', () => {
    // Arrange
    const error: CustomError = new Error();
    error.message = '';
    
    // Act
    errorHandler.handle(error, mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Assert
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error'
    });
  });
});
