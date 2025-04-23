import 'reflect-metadata';
import { CreateUser } from '@user/application/useCases/createUser';
import { IUserRepository } from '@user/domain/interfaces/userRepository';
import { CreateUserDTO } from '@user/application/DTOs/userDTO';
import { mock, instance, when, verify, anything, capture } from 'ts-mockito';
import bcrypt from 'bcrypt';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

jest.mock('bcrypt');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid')
}));

describe('CreateUser', () => {
  let userRepository: IUserRepository;
  let createUser: CreateUser;
  
  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    createUser = new CreateUser(instance(userRepository));
    jest.resetAllMocks();
  });
  
  it('should create a user with hashed password', async () => {
    // Arrange
    const createUserDTO: CreateUserDTO = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      role: 'Admin'
    };
    
    const hashedPassword = 'hashed_password_result';
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    
    const mockDate = new Date();
    jest.spyOn(global, 'Date').mockImplementationOnce(() => mockDate as any);
    
    when(userRepository.create(anything())).thenResolve();
    
    // Act
    await createUser.execute(createUserDTO);
    
    // Assert
    verify(userRepository.create(anything())).once();
    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDTO.password, 10);

    const [createdUser] = capture(userRepository.create).last();
    expect(createdUser).toBeDefined();
    expect(createdUser.name).toBe(createUserDTO.name);
    expect(createdUser.email).toBe(createUserDTO.email);
    expect(createdUser.password).toBe(hashedPassword);
    expect(createdUser.role).toBe(UserRoleEnum.Admin);
    expect(createdUser.createdAt).toEqual(mockDate);
  });
});
