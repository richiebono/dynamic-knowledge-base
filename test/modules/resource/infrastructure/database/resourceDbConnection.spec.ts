import 'reflect-metadata';
import { ResourceDbConnection } from '@resource/infrastructure/database/resourceDbConnection';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';

// Para testar a classe ResourceDbConnection, precisamos "simular" o comportamento
// da classe base DbConnection, que é uma classe singleton
jest.mock('@shared/infrastructure/database/dbConnection', () => {
  // Mock the class itself, not just an object
  return {
    DbConnection: class {
      static getInstance = jest.fn();
      static initialize = jest.fn();
      // ...other static or instance methods if needed...
    }
  };
});

describe('ResourceDbConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call initialize on DbConnection when initializeInstance is called and no instance exists', () => {
    // Arrange
    (DbConnection.getInstance as jest.Mock).mockReturnValue(null);
    
    // Act
    ResourceDbConnection.initializeInstance();
    
    // Assert
    expect(DbConnection.initialize).toHaveBeenCalledTimes(1);
    expect(DbConnection.initialize).toHaveBeenCalledWith(expect.any(ResourceDbConnection));
  });
  
  it('should not call initialize on DbConnection when initializeInstance is called and an instance already exists', () => {
    // Arrange
    (DbConnection.getInstance as jest.Mock).mockReturnValue({});
    
    // Act
    ResourceDbConnection.initializeInstance();
    
    // Assert
    expect(DbConnection.initialize).not.toHaveBeenCalled();
  });
});
