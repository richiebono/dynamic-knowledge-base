import 'reflect-metadata';
import { UpdateResource } from '@resource/application/useCases/updateResource';
import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { Resource } from '@resource/domain/entities/resource';
import { mock, instance, verify, when, anyOfClass } from 'ts-mockito';

describe('UpdateResource UseCase', () => {
  let resourceRepository: IResourceRepository;
  let updateResource: UpdateResource;
  
  beforeEach(() => {
    resourceRepository = mock<IResourceRepository>();
    updateResource = new UpdateResource(instance(resourceRepository));
  });
  
  it('should update an existing resource', async () => {
    const resourceId = 'resource-id';
    const existingResource = new Resource({
      id: resourceId,
      topicId: 'topic-id',
      url: 'http://example.com',
      description: 'Original resource',
      type: 'article',
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(2023, 0, 1)
    });
    
    const resourceDTO: ResourceDTO = {
      id: resourceId,
      topicId: 'topic-id',
      url: 'http://updated-example.com',
      description: 'Updated resource',
      type: 'video',
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date()
    };
    
    when(resourceRepository.findById(resourceId)).thenResolve(existingResource);
    when(resourceRepository.update(anyOfClass(Resource))).thenResolve();
    
    const result = await updateResource.execute(resourceId, resourceDTO);
    
    verify(resourceRepository.findById(resourceId)).once();
    verify(resourceRepository.update(anyOfClass(Resource))).once();
    
    expect(result).toBeInstanceOf(Resource);
    expect(result.id).toBe(resourceId);
    expect(result.url).toBe(resourceDTO.url);
    expect(result.description).toBe(resourceDTO.description);
    expect(result.type).toBe(resourceDTO.type);
    expect(result.createdAt).toEqual(existingResource.createdAt);
    expect(result.updatedAt).not.toEqual(existingResource.updatedAt);
  });
  
  it('should throw an error when resource does not exist', async () => {
    const resourceId = 'non-existent-id';
    const resourceDTO: ResourceDTO = {
      id: resourceId,
      topicId: 'topic-id',
      url: 'http://example.com',
      description: 'Test resource',
      type: 'article',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    when(resourceRepository.findById(resourceId)).thenResolve(null);
    
    await expect(updateResource.execute(resourceId, resourceDTO))
      .rejects.toThrow('Resource not found');
    
    verify(resourceRepository.findById(resourceId)).once();
    verify(resourceRepository.update(anyOfClass(Resource))).never();
  });
});
