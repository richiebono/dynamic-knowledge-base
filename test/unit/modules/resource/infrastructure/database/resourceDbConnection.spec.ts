import 'reflect-metadata';
import { ResourceDbConnection } from '@resource/infrastructure/database/resourceDbConnection';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';

jest.spyOn(DbConnection, 'isInitialized').mockReturnValue(false);
jest.spyOn(DbConnection, 'initialize').mockImplementation(jest.fn());

describe('ResourceDbConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call initialize on DbConnection when initializeInstance is called and no instance exists', () => {
    (DbConnection.isInitialized as jest.Mock).mockReturnValue(false);
    ResourceDbConnection.initializeInstance();
    expect(DbConnection.isInitialized).toHaveBeenCalled();
    expect(DbConnection.initialize).toHaveBeenCalledTimes(1);
    expect(DbConnection.initialize).toHaveBeenCalledWith(expect.any(ResourceDbConnection));
  });

  it('should not call initialize on DbConnection when initializeInstance is called and an instance already exists', () => {
    (DbConnection.isInitialized as jest.Mock).mockReturnValue(true);
    ResourceDbConnection.initializeInstance();
    expect(DbConnection.isInitialized).toHaveBeenCalled();
    expect(DbConnection.initialize).not.toHaveBeenCalled();
  });
});
