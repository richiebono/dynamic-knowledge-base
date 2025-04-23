import 'reflect-metadata';
import { GetResourceById } from '@resource/application/useCases/getResourceById';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { Resource } from '@resource/domain/entities/resource';
import { mock, instance, verify, when } from 'ts-mockito';

describe('GetResourceById UseCase', () => {
  let resourceRepository: IResourceRepository;
  let getResourceById: GetResourceById;
  
  beforeEach(() => {
    resourceRepository = mock<IResourceRepository>();
    getResourceById = new GetResourceById(instance(resourceRepository));
  });
  
  it('should return a resource DTO when resource exists', async () => {
    const resourceId = 'resource-id';
    const resource = new Resource({
      id: resourceId,
      topicId: 'topic-id',
      url: 'http://example.com',
      description: 'Test resource',
      type: 'article',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    when(resourceRepository.findById(resourceId)).thenResolve(resource);
    
    const result = await getResourceById.execute(resourceId);
    
    verify(resourceRepository.findById(resourceId)).once();
    expect(result).not.toBeNull();
    expect(result?.id).toBe(resourceId);
    expect(result?.topicId).toBe(resource.topicId);
    expect(result?.url).toBe(resource.url);
    expect(result?.description).toBe(resource.description);
    expect(result?.type).toBe(resource.type);
  });
  
  it('should return null when resource does not exist', async () => {
    const resourceId = 'non-existent-id';
    
    when(resourceRepository.findById(resourceId)).thenResolve(null);
    
    const result = await getResourceById.execute(resourceId);
    
    verify(resourceRepository.findById(resourceId)).once();
    expect(result).toBeNull();
  });
});
