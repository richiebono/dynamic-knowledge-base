import 'reflect-metadata';
import { TopicDbConnection } from '@topic/infrastructure/database/topicDbConnection';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';

jest.spyOn(DbConnection, 'isInitialized').mockReturnValue(false);
jest.spyOn(DbConnection, 'initialize').mockImplementation(jest.fn());

describe('TopicDbConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call initialize on DbConnection when initializeInstance is called and no instance exists', () => {
    (DbConnection.isInitialized as jest.Mock).mockReturnValue(false);
    TopicDbConnection.initializeInstance();
    expect(DbConnection.isInitialized).toHaveBeenCalled();
    expect(DbConnection.initialize).toHaveBeenCalledTimes(1);
    expect(DbConnection.initialize).toHaveBeenCalledWith(expect.any(TopicDbConnection));
  });

  it('should not call initialize on DbConnection when initializeInstance is called and an instance already exists', () => {
    (DbConnection.isInitialized as jest.Mock).mockReturnValue(true);
    TopicDbConnection.initializeInstance();
    expect(DbConnection.isInitialized).toHaveBeenCalled();
    expect(DbConnection.initialize).not.toHaveBeenCalled();
  });
});
