import 'reflect-metadata';
import { UserCommandHandler } from '@user/application/handlers/userCommandHandler';
import { CreateUser } from '@user/application/useCases/createUser';
import { UpdateUser } from '@user/application/useCases/updateUser';
import { DeleteUser } from '@user/application/useCases/deleteUser';
import { LoginUser } from '@user/application/useCases/loginUser';
import { CreateUserDTO, UpdateUserDTO, LoginDTO } from '@user/application/DTOs/userDTO';
import { mock, instance, when, verify } from 'ts-mockito';

describe('UserCommandHandler', () => {
  let createUser: CreateUser;
  let updateUser: UpdateUser;
  let deleteUser: DeleteUser;
  let loginUser: LoginUser;
  let userCommandHandler: UserCommandHandler;
  
  beforeEach(() => {
    createUser = mock(CreateUser);
    updateUser = mock(UpdateUser);
    deleteUser = mock(DeleteUser);
    loginUser = mock(LoginUser);
    
    userCommandHandler = new UserCommandHandler(
      instance(createUser),
      instance(updateUser),
      instance(deleteUser),
      instance(loginUser)
    );
  });
  
  describe('createUser', () => {
    it('should delegate to createUserUseCase', async () => {
      // Arrange
      const createUserDTO: CreateUserDTO = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        role: 'Admin'
      };
      
      when(createUser.execute(createUserDTO)).thenResolve();
      
      // Act
      await userCommandHandler.createUser(createUserDTO);
      
      // Assert
      verify(createUser.execute(createUserDTO)).once();
    });
  });
  
  describe('updateUser', () => {
    it('should delegate to updateUserUseCase', async () => {
      // Arrange
      const userId = 'user-id';
      const updateUserDTO: UpdateUserDTO = {
        id: userId,
        name: 'Updated Name'
      };
      
      when(updateUser.execute(userId, updateUserDTO)).thenResolve();
      
      // Act
      await userCommandHandler.updateUser(userId, updateUserDTO);
      
      // Assert
      verify(updateUser.execute(userId, updateUserDTO)).once();
    });
  });
  
  describe('deleteUser', () => {
    it('should delegate to deleteUserUseCase', async () => {
      // Arrange
      const userId = 'user-id';
      when(deleteUser.execute(userId)).thenResolve();
      
      // Act
      await userCommandHandler.deleteUser(userId);
      
      // Assert
      verify(deleteUser.execute(userId)).once();
    });
  });
  
  describe('loginUser', () => {
    it('should delegate to loginUserUseCase and return token', async () => {
      // Arrange
      const loginDTO: LoginDTO = {
        email: 'user@example.com',
        password: 'password123'
      };
      
      const expectedToken = 'jwt-token';
      when(loginUser.execute(loginDTO)).thenResolve(expectedToken);
      
      // Act
      const result = await userCommandHandler.loginUser(loginDTO);
      
      // Assert
      verify(loginUser.execute(loginDTO)).once();
      expect(result).toBe(expectedToken);
    });
  });
});
