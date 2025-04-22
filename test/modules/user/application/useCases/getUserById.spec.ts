import 'reflect-metadata';
import { GetUserById } from '@user/application/useCases/getUserById';
import { IUserRepository } from '@user/domain/interfaces/userRepository';
import { User } from '@user/domain/entities/user';
import { mock, instance, when, verify } from 'ts-mockito';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

describe('GetUserById', () => {
  let userRepository: IUserRepository;
  let getUserById: GetUserById;
  
  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    getUserById = new GetUserById(instance(userRepository));
  });
  
  it('should return null when user does not exist', async () => {
    // Arrange
    const userId = 'non-existent-id';
    when(userRepository.findById(userId)).thenResolve(null);
    
    // Act
    const result = await getUserById.execute(userId);
    
    // Assert
    verify(userRepository.findById(userId)).once();
    expect(result).toBeNull();
  });
  
  it('should return user DTO when user exists', async () => {
    // Arrange
    const userId = 'existing-id';
    const mockUser = new User({
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: UserRoleEnum.Viewer,
      createdAt: new Date()
    });
    
    when(userRepository.findById(userId)).thenResolve(mockUser);
    
    // Act
    const result = await getUserById.execute(userId);
    
    // Assert
    verify(userRepository.findById(userId)).once();
    expect(result).not.toBeNull();
    expect(result?.id).toBe(userId);
    expect(result?.name).toBe(mockUser.name);
    expect(result?.email).toBe(mockUser.email);
    expect(result?.role).toBe(UserRoleEnum.Viewer.toString());
    expect(result?.createdAt).toBe(mockUser.createdAt);
    
    // Password should not be included in the DTO
    expect(result).not.toHaveProperty('password');
  });
});
