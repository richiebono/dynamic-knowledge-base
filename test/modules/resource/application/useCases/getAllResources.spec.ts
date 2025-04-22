import 'reflect-metadata';
import { GetAllResources } from '@resource/application/useCases/getAllResources';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { Resource } from '@resource/domain/entities/resource';
import { mock, instance, verify, when } from 'ts-mockito';

describe('GetAllResources UseCase', () => {
  let resourceRepository: IResourceRepository;
  let getAllResources: GetAllResources;
  
  beforeEach(() => {
    resourceRepository = mock<IResourceRepository>();
    getAllResources = new GetAllResources(instance(resourceRepository));
  });
  
  it('should return paginated resources with limit and offset', async () => {
    const limit = 10;
    const offset = 0;
    const orderBy = 'createdAt';
    const orderDirection = 'desc';
    
    const resources = [
      new Resource({
        id: 'resource-1',
        topicId: 'topic-1',
        url: 'http://example1.com',
        description: 'Resource 1',
        type: 'article',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      new Resource({
        id: 'resource-2',
        topicId: 'topic-2',
        url: 'http://example2.com',
        description: 'Resource 2',
        type: 'video',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ];
    
    when(resourceRepository.findAllPaginated(limit, offset, orderBy, orderDirection)).thenResolve(resources);
    
    const result = await getAllResources.execute(limit, offset, orderBy, orderDirection);
    
    verify(resourceRepository.findAllPaginated(limit, offset, orderBy, orderDirection)).once();
    
    expect(result.resources).toHaveLength(2);
    expect(result.limit).toBe(limit);
    expect(result.offset).toBe(offset);
    expect(result.resources[0].id).toBe('resource-1');
    expect(result.resources[1].id).toBe('resource-2');
  });
  
  it('should return empty resources array when no resources exist', async () => {
    const limit = 10;
    const offset = 0;
    const orderBy = 'createdAt';
    const orderDirection = 'desc';
    
    when(resourceRepository.findAllPaginated(limit, offset, orderBy, orderDirection)).thenResolve([]);
    
    const result = await getAllResources.execute(limit, offset, orderBy, orderDirection);
    
    verify(resourceRepository.findAllPaginated(limit, offset, orderBy, orderDirection)).once();
    
    expect(result.resources).toHaveLength(0);
    expect(result.limit).toBe(limit);
    expect(result.offset).toBe(offset);
  });
});
