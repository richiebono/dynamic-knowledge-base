import 'reflect-metadata';
import { CreateResource } from '@resource/application/useCases/createResource';
import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { Resource } from '@resource/domain/entities/resource';
import { mock, instance, verify, when, anyOfClass } from 'ts-mockito';

describe('CreateResource UseCase', () => {
  let resourceRepository: IResourceRepository;
  let createResource: CreateResource;
  
  beforeEach(() => {
    resourceRepository = mock<IResourceRepository>();
    createResource = new CreateResource(instance(resourceRepository));
  });
  
  it('should create a new resource', async () => {
    const resourceDTO: ResourceDTO = {
      id: 'resource-id',
      topicId: 'topic-id',
      url: 'http://example.com',
      description: 'Test resource',
      type: 'article',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const createdResource = new Resource({
      id: resourceDTO.id,
      topicId: resourceDTO.topicId,
      url: resourceDTO.url,
      description: resourceDTO.description,
      type: resourceDTO.type,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
    
    when(resourceRepository.create(anyOfClass(Resource))).thenResolve(createdResource);
    
    const result = await createResource.execute(resourceDTO);
    
    verify(resourceRepository.create(anyOfClass(Resource))).once();
    expect(result).toBeInstanceOf(Resource);
    expect(result.id).toBe(resourceDTO.id);
    expect(result.topicId).toBe(resourceDTO.topicId);
    expect(result.url).toBe(resourceDTO.url);
    expect(result.description).toBe(resourceDTO.description);
    expect(result.type).toBe(resourceDTO.type);
  });
});
