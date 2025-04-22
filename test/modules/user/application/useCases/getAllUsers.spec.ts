import 'reflect-metadata';
import { GetAllUsers } from '@user/application/useCases/getAllUsers';
import { IUserRepository } from '@user/domain/interfaces/userRepository';
import { User } from '@user/domain/entities/user';
import { mock, instance, when, verify } from 'ts-mockito';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

describe('GetAllUsers', () => {
  let userRepository: IUserRepository;
  let getAllUsers: GetAllUsers;
  
  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    getAllUsers = new GetAllUsers(instance(userRepository));
  });
  
  it('should return empty array when no users exist', async () => {
    // Arrange
    const limit = 10;
    const offset = 0;
    const orderBy = 'createdAt';
    const orderDirection = 'DESC' as const;
    
    when(userRepository.findAll(limit, offset, orderBy, orderDirection))
      .thenResolve([]);
    
    // Act
    const result = await getAllUsers.execute(limit, offset, orderBy, orderDirection);
    
    // Assert
    verify(userRepository.findAll(limit, offset, orderBy, orderDirection)).once();
    expect(result).toEqual([]);
  });
  
  it('should map users to user DTOs', async () => {
    // Arrange
    const limit = 10;
    const offset = 0;
    const orderBy = 'name';
    const orderDirection = 'ASC' as const;
    
    const mockUsers = [
      new User({
        id: 'user-1',
        name: 'Alice',
        email: 'alice@example.com',
        password: 'hashedPassword1',
        role: UserRoleEnum.Admin,
        createdAt: new Date(2023, 0, 1)
      }),
      new User({
        id: 'user-2',
        name: 'Bob',
        email: 'bob@example.com',
        password: 'hashedPassword2',
        role: UserRoleEnum.Viewer,
        createdAt: new Date(2023, 0, 2)
      })
    ];
    
    when(userRepository.findAll(limit, offset, orderBy, orderDirection))
      .thenResolve(mockUsers);
    
    // Act
    const result = await getAllUsers.execute(limit, offset, orderBy, orderDirection);
    
    // Assert
    verify(userRepository.findAll(limit, offset, orderBy, orderDirection)).once();
    expect(result).toHaveLength(2);
    
    // Check first user mapping
    expect(result[0].id).toBe(mockUsers[0].id);
    expect(result[0].name).toBe(mockUsers[0].name);
    expect(result[0].email).toBe(mockUsers[0].email);
    expect(result[0].role).toBe(UserRoleEnum.Admin.toString());
    expect(result[0].createdAt).toBe(mockUsers[0].createdAt);
    expect(result[0]).not.toHaveProperty('password');
    
    // Check second user mapping
    expect(result[1].id).toBe(mockUsers[1].id);
    expect(result[1].name).toBe(mockUsers[1].name);
    expect(result[1].email).toBe(mockUsers[1].email);
    expect(result[1].role).toBe(UserRoleEnum.Viewer.toString());
    expect(result[1].createdAt).toBe(mockUsers[1].createdAt);
    expect(result[1]).not.toHaveProperty('password');
  });
});
