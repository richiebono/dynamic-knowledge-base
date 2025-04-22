import 'reflect-metadata';
import { UserRepository } from '@user/infrastructure/repository/userRepository';
import { UserDbConnection } from '@user/infrastructure/database/userDbConnection';
import { User } from '@user/domain/entities/user';
import { mock, instance, verify, when, anything } from 'ts-mockito';
import { QueryResult } from 'pg';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

describe('UserRepository', () => {
  let dbConnection: UserDbConnection;
  let repository: UserRepository;
  
  beforeEach(() => {
    dbConnection = mock(UserDbConnection);
    repository = new UserRepository(instance(dbConnection));
  });

  it('should create a user', async () => {
    // Arrange
    const user = new User({
      id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: UserRoleEnum.Admin,
      password: 'hashedPassword',
      createdAt: new Date(),
    });

    const queryResult: QueryResult = {
      rows: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          password: user.password,
          createdAt: user.createdAt,
        },
      ],
      command: 'INSERT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.create(user);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeInstanceOf(User);
    expect(result.id).toBe(user.id);
    expect(result.name).toBe(user.name);
    expect(result.email).toBe(user.email);
    expect(result.role).toBe(user.role);
  });

  it('should update a user', async () => {
    // Arrange
    const user = new User({
      id: 'user-id',
      name: 'Updated User',
      email: 'updated@example.com',
      role: UserRoleEnum.Editor,
      password: 'updatedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const queryResult: QueryResult = {
      rows: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          password: user.password,
          updatedAt: user.updatedAt,
        },
      ],
      command: 'UPDATE',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.update(user);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeInstanceOf(User);
    expect(result.name).toBe('Updated User');
    expect(result.email).toBe('updated@example.com');
  });

  it('should find a user by id', async () => {
    // Arrange
    const userId = 'user-id';
    const queryResult: QueryResult = {
      rows: [
        {
          id: userId,
          name: 'Test User',
          email: 'test@example.com',
          role: 'Admin',
          password: 'hashedPassword',
          createdAt: new Date(),
        },
      ],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.findById(userId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeInstanceOf(User);
    expect(result?.id).toBe(userId);
  });

  it('should return null when user not found by id', async () => {
    // Arrange
    const userId = 'non-existent-id';
    when(dbConnection.query(anything(), anything())).thenResolve({ 
      rows: [],
      command: 'SELECT',
      rowCount: 0,
      oid: 0,
      fields: [],
    });

    // Act
    const result = await repository.findById(userId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeNull();
  });

  it('should find a user by email', async () => {
    // Arrange
    const userEmail = 'test@example.com';
    const queryResult: QueryResult = {
      rows: [
        {
          id: 'user-id',
          name: 'Test User',
          email: userEmail,
          role: 'Admin',
          password: 'hashedPassword',
        },
      ],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.findByEmail(userEmail);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeInstanceOf(User);
    expect(result?.email).toBe(userEmail);
  });

  it('should find paginated users', async () => {
    // Arrange
    const limit = 10;
    const offset = 0;
    const orderBy = 'createdAt';
    const orderDirection = 'DESC';

    const queryResult: QueryResult = {
      rows: [
        {
          id: 'user-1',
          name: 'User One',
          email: 'user1@example.com',
          role: 'Admin',
          password: 'hashedPassword1',
          createdAt: new Date(),
        },
        {
          id: 'user-2',
          name: 'User Two',
          email: 'user2@example.com',
          role: 'Viewer',
          password: 'hashedPassword2',
          createdAt: new Date(),
        },
      ],
      command: 'SELECT',
      rowCount: 2,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.findAll(limit, offset, orderBy, orderDirection);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(User);
    expect(result[1]).toBeInstanceOf(User);
  });

  it('should delete a user', async () => {
    // Arrange
    const userId = 'user-id';
    when(dbConnection.query(anything(), anything())).thenResolve({ 
      rows: [],
      command: 'DELETE',
      rowCount: 1,
      oid: 0,
      fields: [],
    });

    // Act
    await repository.delete(userId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
  });

  it('should get total users count', async () => {
    // Arrange
    const count = 42;
    const queryResult: QueryResult = {
      rows: [{ count: count.toString() }],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything())).thenResolve(queryResult);

    // Act
    const result = await repository.getTotalUsersCount();

    // Assert
    verify(dbConnection.query(anything())).once();
    expect(result).toBe(count);
  });
});
