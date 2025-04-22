import 'reflect-metadata';
import { UserQueryHandler } from '@user/application/handlers/userQueryHandler';
import { GetUserById } from '@user/application/useCases/getUserById';
import { GetAllUsers } from '@user/application/useCases/getAllUsers';
import { GetTotalUsersCount } from '@user/application/useCases/getTotalUsersCount';
import { UserDTO } from '@user/application/DTOs/userDTO';
import { mock, instance, when, verify } from 'ts-mockito';

describe('UserQueryHandler', () => {
  let getUserById: GetUserById;
  let getAllUsers: GetAllUsers;
  let getTotalUsersCount: GetTotalUsersCount;
  let userQueryHandler: UserQueryHandler;
  
  beforeEach(() => {
    getUserById = mock(GetUserById);
    getAllUsers = mock(GetAllUsers);
    getTotalUsersCount = mock(GetTotalUsersCount);
    
    userQueryHandler = new UserQueryHandler(
      instance(getUserById),
      instance(getAllUsers),
      instance(getTotalUsersCount)
    );
  });
  
  describe('getUserById', () => {
    it('should delegate to getUserByIdUseCase and return its result', async () => {
      // Arrange
      const userId = 'user-id';
      const mockUserDTO: UserDTO = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        role: 'Viewer',
        createdAt: new Date()
      };
      
      when(getUserById.execute(userId)).thenResolve(mockUserDTO);
      
      // Act
      const result = await userQueryHandler.getUserById(userId);
      
      // Assert
      verify(getUserById.execute(userId)).once();
      expect(result).toBe(mockUserDTO);
    });
    
    it('should return null when user is not found', async () => {
      // Arrange
      const userId = 'non-existent-id';
      when(getUserById.execute(userId)).thenResolve(null);
      
      // Act
      const result = await userQueryHandler.getUserById(userId);
      
      // Assert
      verify(getUserById.execute(userId)).once();
      expect(result).toBeNull();
    });
  });
  
  describe('getAllUsers', () => {
    it('should combine results from getAllUsers and getTotalUsersCount', async () => {
      // Arrange
      const limit = 10;
      const offset = 0;
      const orderBy = 'createdAt';
      const orderDirection = 'DESC' as const;
      
      const mockUsers: UserDTO[] = [
        {
          id: 'user-1',
          name: 'User One',
          email: 'one@example.com',
          role: 'Admin',
          createdAt: new Date()
        }
      ];
      
      const totalCount = 1;
      
      when(getAllUsers.execute(limit, offset, orderBy, orderDirection))
        .thenResolve(mockUsers);
      when(getTotalUsersCount.execute()).thenResolve(totalCount);
      
      // Act
      const result = await userQueryHandler.getAllUsers(
        limit, offset, orderBy, orderDirection
      );
      
      // Assert
      verify(getAllUsers.execute(limit, offset, orderBy, orderDirection)).once();
      verify(getTotalUsersCount.execute()).once();
      
      expect(result).toEqual({
        users: mockUsers,
        total: totalCount,
        limit,
        offset
      });
    });
  });
});
