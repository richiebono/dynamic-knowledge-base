import { Pool, PoolClient, QueryResult } from 'pg';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';
import { ENV } from '@shared/infrastructure/config/env';

class TestDbConnection extends DbConnection {
  constructor() {
    super();
  }
}

jest.mock('pg', () => {
  const mockQueryResult = {
    rows: [{ id: 1, name: 'test' }],
    rowCount: 1,
  };
  
  const mockClient = {
    query: jest.fn().mockResolvedValue(mockQueryResult),
    release: jest.fn(),
  };
  
  const mockPool = {
    query: jest.fn().mockResolvedValue(mockQueryResult),
    connect: jest.fn().mockResolvedValue(mockClient),
    end: jest.fn().mockResolvedValue(undefined),
  };
  
  return {
    Pool: jest.fn(() => mockPool),
  };
});

describe('DbConnection', () => {
  let dbConnection: TestDbConnection;
  let mockPool: jest.Mocked<Pool>;
  
  beforeEach(() => {
    (DbConnection as any).instance = undefined;
    
    dbConnection = new TestDbConnection();
    mockPool = dbConnection.pool as jest.Mocked<Pool>;
  });

  it('should create a pool with correct configuration', () => {
    // Assert
    expect(Pool).toHaveBeenCalledWith({
      user: ENV.POSTGRES.USER,
      host: ENV.POSTGRES.HOST,
      database: ENV.POSTGRES.DATABASE,
      password: ENV.POSTGRES.PASSWORD,
      port: ENV.POSTGRES.PORT,
    });
  });

  it('should throw error when getting instance without initialization', () => {
    // Act & Assert
    expect(() => DbConnection.getInstance()).toThrow(
      'DbConnection instance is not initialized. Use a subclass to initialize it.'
    );
  });

  it('should initialize and get the same instance', () => {
    // Act
    DbConnection.initialize(dbConnection);
    const instance = DbConnection.getInstance();
    
    // Assert
    expect(instance).toBe(dbConnection);
  });
  
  it('should throw error when initializing more than once', () => {
    // Arrange
    DbConnection.initialize(dbConnection);
    const anotherConnection = new TestDbConnection();
    
    // Act & Assert
    expect(() => DbConnection.initialize(anotherConnection))
      .toThrow('DbConnection instance is already initialized.');
  });

  it('should execute a query', async () => {
    // Arrange
    const sql = 'SELECT * FROM users WHERE id = $1';
    const params = [1];
    
    // Act
    const result = await dbConnection.query(sql, params);
    
    // Assert
    expect(mockPool.query).toHaveBeenCalledWith(sql, params);
    expect(result).toEqual({
      rows: [{ id: 1, name: 'test' }],
      rowCount: 1,
    });
  });

  it('should get a client', async () => {
    // Act
    const client = await dbConnection.getClient();
    
    // Assert
    expect(mockPool.connect).toHaveBeenCalled();
    expect(client).toBeDefined();
  });

  it('should close the connection', async () => {
    // Act
    await dbConnection.close();
    
    // Assert
    expect(mockPool.end).toHaveBeenCalled();
  });
});
