import 'reflect-metadata';
import { GetTotalResourceCount } from '@resource/application/useCases/getTotalResourceCount';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { mock, instance, verify, when } from 'ts-mockito';

describe('GetTotalResourceCount UseCase', () => {
  let resourceRepository: IResourceRepository;
  let getTotalResourceCount: GetTotalResourceCount;
  
  beforeEach(() => {
    resourceRepository = mock<IResourceRepository>();
    getTotalResourceCount = new GetTotalResourceCount(instance(resourceRepository));
  });
  
  it('should return the total count of resources', async () => {
    const totalCount = 42;
    
    when(resourceRepository.getTotalResourceCount()).thenResolve(totalCount);
    
    const result = await getTotalResourceCount.execute();
    
    verify(resourceRepository.getTotalResourceCount()).once();
    expect(result).toBe(totalCount);
  });
  
  it('should return 0 when no resources exist', async () => {
    when(resourceRepository.getTotalResourceCount()).thenResolve(0);
    
    const result = await getTotalResourceCount.execute();
    
    verify(resourceRepository.getTotalResourceCount()).once();
    expect(result).toBe(0);
  });
});
