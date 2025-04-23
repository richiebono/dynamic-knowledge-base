import { MigrationRunner } from '@shared/infrastructure/database/migrationRunner';
import { Pool, PoolClient, QueryResult } from 'pg';

describe('MigrationRunner', () => {
  let migrationRunner: MigrationRunner;
  let mockPool: jest.Mocked<Pool>;
  let mockClient: jest.Mocked<PoolClient>;
  
  beforeEach(() => {
    mockClient = {
      query: jest.fn().mockResolvedValue({} as QueryResult),
      release: jest.fn(),
    } as unknown as jest.Mocked<PoolClient>;
    
    mockPool = {
      connect: jest.fn().mockResolvedValue(mockClient),
      end: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<Pool>;
    
    migrationRunner = new MigrationRunner(mockPool);
    
    jest.spyOn(console, 'log').mockImplementation((..._args: any[]) => {});
    jest.spyOn(console, 'error').mockImplementation((..._args: any[]) => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('up', () => {
    it('should create required tables', async () => {
      // Act
      await migrationRunner.up();
      
      // Assert
      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledTimes(4); // Changed from 3 to 4
      expect(mockClient.release).toHaveBeenCalled();
      
      const calls = mockClient.query.mock.calls;
      expect(calls[0][0]).toContain('CREATE TABLE IF NOT EXISTS users');
      expect(calls[1][0]).toContain('DO $$');
      expect(calls[2][0]).toContain('CREATE TABLE IF NOT EXISTS topics');
      expect(calls[3][0]).toContain('CREATE TABLE IF NOT EXISTS resources');
    });
    
    it('should handle errors during migration', async () => {
      // Arrange
      const error = new Error('Database error');
      mockClient.query.mockImplementationOnce(() => Promise.reject(error));
      
      // Act & Assert
      await expect(migrationRunner.up()).rejects.toThrow('Database error');
      expect(mockClient.release).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('down', () => {
    it('should drop all tables', async () => {
      // Act
      await migrationRunner.down();
      
      // Assert
      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledTimes(3);
      expect(mockClient.release).toHaveBeenCalled();
      
      const calls = mockClient.query.mock.calls;
      expect(calls[0][0]).toContain('DROP TABLE IF EXISTS resources');
      expect(calls[1][0]).toContain('DROP TABLE IF EXISTS topics');
      expect(calls[2][0]).toContain('DROP TABLE IF EXISTS users');
    });
    
    it('should handle errors during migration reversion', async () => {
      // Arrange
      const error = new Error('Database error');
      mockClient.query.mockImplementationOnce(() => Promise.reject(error));
      
      // Act & Assert
      await expect(migrationRunner.down()).rejects.toThrow('Database error');
      expect(mockClient.release).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close the database connection pool', async () => {
      // Act
      await migrationRunner.close();
      
      // Assert
      expect(mockPool.end).toHaveBeenCalled();
    });
  });
});
