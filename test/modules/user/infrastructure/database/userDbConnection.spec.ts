import 'reflect-metadata';
import { UserDbConnection } from '@user/infrastructure/database/userDbConnection';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';

jest.spyOn(DbConnection, 'getInstance').mockImplementation(jest.fn());
jest.spyOn(DbConnection, 'initialize').mockImplementation(jest.fn());

describe('UserDbConnection', () => {
  let userDbConnection: UserDbConnection;

  beforeEach(() => {
    userDbConnection = new UserDbConnection();
  });

  it('should be defined', () => {
    expect(userDbConnection).toBeDefined();
  });

  it('should call DbConnection.getInstance', () => {
    UserDbConnection.initializeInstance();
    expect(DbConnection.getInstance).toHaveBeenCalled();
  });

  it('should call DbConnection.initialize', () => {
    UserDbConnection.initializeInstance();
    expect(DbConnection.initialize).toHaveBeenCalled();
  });
});
