import 'reflect-metadata';
import { LoginUser } from '@user/application/useCases/loginUser';
import { IUserRepository } from '@user/domain/interfaces/userRepository';
import { User } from '@user/domain/entities/user';
import { LoginDTO } from '@user/application/DTOs/userDTO';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRoleEnum } from '@shared/domain/enum/userRole';
import { ENV } from '@shared/infrastructure/config/env';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('LoginUser', () => {
  let userRepository: IUserRepository;
  let loginUser: LoginUser;
  
  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    loginUser = new LoginUser(instance(userRepository));
    
    jest.resetAllMocks();
  });
  
  it('should throw error when user is not found', async () => {
    // Arrange
    const loginDTO: LoginDTO = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };
    
    when(userRepository.findByEmail(loginDTO.email)).thenResolve(null);
    
    // Act & Assert
    await expect(loginUser.execute(loginDTO))
      .rejects.toThrow('Invalid email or password');
    
    verify(userRepository.findByEmail(loginDTO.email)).once();
  });
  
  it('should throw error when password is invalid', async () => {
    // Arrange
    const loginDTO: LoginDTO = {
      email: 'user@example.com',
      password: 'wrongPassword'
    };
    
    const user = new User({
      id: 'user-id',
      name: 'Test User',
      email: loginDTO.email,
      password: 'hashedPassword',
      role: UserRoleEnum.Viewer,
      createdAt: new Date()
    });
    
    when(userRepository.findByEmail(loginDTO.email)).thenResolve(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    
    // Act & Assert
    await expect(loginUser.execute(loginDTO))
      .rejects.toThrow('Invalid email or password');
    
    verify(userRepository.findByEmail(loginDTO.email)).once();
    expect(bcrypt.compare).toHaveBeenCalledWith(loginDTO.password, user.password);
  });
  
  it('should return a token and userId when login is successful', async () => {
    // Arrange
    const loginDTO: LoginDTO = {
      email: 'user@example.com',
      password: 'validPassword'
    };
    
    const user = new User({
      id: 'user-id',
      name: 'Test User',
      email: loginDTO.email,
      password: 'hashedPassword',
      role: UserRoleEnum.Admin,
      createdAt: new Date()
    });
    
    const mockedToken = 'generated-jwt-token';
    
    when(userRepository.findByEmail(loginDTO.email)).thenResolve(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue(mockedToken);
    
    // Act
    const result = await loginUser.execute(loginDTO);
    
    // Assert
    verify(userRepository.findByEmail(loginDTO.email)).once();
    expect(bcrypt.compare).toHaveBeenCalledWith(loginDTO.password, user.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: user.id, role: user.role },
      ENV.JWT.SECRET,
      { expiresIn: ENV.JWT.EXPIRES_IN }
    );
    expect(result).toEqual({
      token: mockedToken,
      userId: user.id
    });
  });
});
