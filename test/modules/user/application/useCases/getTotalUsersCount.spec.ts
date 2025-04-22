import 'reflect-metadata';
import { GetTotalUsersCount } from '@user/application/useCases/getTotalUsersCount';
import { IUserRepository } from '@user/domain/interfaces/userRepository';
import { mock, instance, when, verify } from 'ts-mockito';

describe('GetTotalUsersCount', () => {
  let userRepository: IUserRepository;
  let getTotalUsersCount: GetTotalUsersCount;
  
  beforeEach(() => {
    userRepository = mock<IUserRepository>();
    getTotalUsersCount = new GetTotalUsersCount(instance(userRepository));
  });
  
  it('should return the total number of users', async () => {
    // Arrange
    const expectedCount = 42;
    when(userRepository.getTotalUsersCount()).thenResolve(expectedCount);
    
    // Act
    const result = await getTotalUsersCount.execute();
    
    // Assert
    verify(userRepository.getTotalUsersCount()).once();
    expect(result).toBe(expectedCount);
  });
  
  it('should return zero when there are no users', async () => {
    // Arrange
    when(userRepository.getTotalUsersCount()).thenResolve(0);
    
    // Act
    const result = await getTotalUsersCount.execute();
    
    // Assert
    expect(result).toBe(0);
  });
});
