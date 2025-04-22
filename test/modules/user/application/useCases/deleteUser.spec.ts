import 'reflect-metadata';
import { DeleteUser } from '@user/application/useCases/deleteUser';
import { IUserRepository } from '@user/domain/interfaces/userRepository';
import { User } from '@user/domain/entities/user';
import { mock, instance, when, verify } from 'ts-mockito';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

describe('DeleteUser', () => {
  let userRepository: IUserRepository;
  let deleteUser: DeleteUser;
  
  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    deleteUser = new DeleteUser(instance(userRepository));
  });
  
  it('should throw error if user does not exist', async () => {
    // Arrange
    const userId = 'non-existent-id';
    when(userRepository.findById(userId)).thenResolve(null);
    
    // Act & Assert
    await expect(deleteUser.execute(userId)).rejects.toThrow('User not found');
    verify(userRepository.findById(userId)).once();
    verify(userRepository.delete(userId)).never();
  });
  
  it('should delete user if user exists', async () => {
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
    when(userRepository.delete(userId)).thenResolve();
    
    // Act
    await deleteUser.execute(userId);
    
    // Assert
    verify(userRepository.findById(userId)).once();
    verify(userRepository.delete(userId)).once();
  });
});
