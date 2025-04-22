import 'reflect-metadata';
import { TopicDbConnection } from '@topic/infrastructure/database/topicDbConnection';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';


jest.mock('@shared/infrastructure/database/dbConnection', () => {
  return {
    DbConnection: class {
      static getInstance = jest.fn();
      static initialize = jest.fn();
    }
  };
});

describe('TopicDbConnection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize a new instance when none exists', () => {
    // Arrange
    (DbConnection.getInstance as jest.Mock).mockReturnValue(null);
    
    // Act
    TopicDbConnection.initializeInstance();
    
    // Assert
    expect(DbConnection.initialize).toHaveBeenCalled();
    const initializeArg = (DbConnection.initialize as jest.Mock).mock.calls[0][0];
    expect(initializeArg).toBeInstanceOf(TopicDbConnection);
  });

  it('should not initialize a new instance when one already exists', () => {
    // Arrange
    const mockInstance = {};
    (DbConnection.getInstance as jest.Mock).mockReturnValue(mockInstance);
    
    // Act
    TopicDbConnection.initializeInstance();
    
    // Assert
    expect(DbConnection.initialize).not.toHaveBeenCalled();
  });
});
