import { QueryBus, IQuery } from '@shared/application/queryBus';

describe('QueryBus', () => {
  let queryBus: QueryBus;

  beforeEach(() => {
    queryBus = new QueryBus();
  });

  it('should register and execute query handlers', async () => {
    // Arrange
    const mockHandler: IQuery = {
      execute: jest.fn().mockResolvedValue({ result: 'success' })
    };
    const queryName = 'GetAllTopics';
    const queryParams = { limit: 10, offset: 0 };
    
    // Act
    queryBus.register(queryName, mockHandler);
    const result = await queryBus.execute(queryName, queryParams);
    
    // Assert
    expect(mockHandler.execute).toHaveBeenCalledWith(queryParams);
    expect(result).toEqual({ result: 'success' });
  });

  it('should throw error when executing unregistered query', async () => {
    // Arrange
    const unregisteredQueryName = 'UnregisteredQuery';
    
    // Act & Assert
    await expect(queryBus.execute(unregisteredQueryName, {}))
      .rejects
      .toThrow(`No handler registered for query: ${unregisteredQueryName}`);
  });

  it('should allow overriding a previously registered handler', async () => {
    // Arrange
    const queryName = 'GetTopic';
    const firstHandler: IQuery = {
      execute: jest.fn().mockResolvedValue({ version: 1 })
    };
    const secondHandler: IQuery = {
      execute: jest.fn().mockResolvedValue({ version: 2 })
    };
    
    // Act
    queryBus.register(queryName, firstHandler);
    queryBus.register(queryName, secondHandler);
    const result = await queryBus.execute(queryName, {});
    
    // Assert
    expect(firstHandler.execute).not.toHaveBeenCalled();
    expect(secondHandler.execute).toHaveBeenCalled();
    expect(result).toEqual({ version: 2 });
  });
});
