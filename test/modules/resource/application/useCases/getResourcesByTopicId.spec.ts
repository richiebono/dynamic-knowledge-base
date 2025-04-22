import 'reflect-metadata';
import { GetResourcesByTopicId } from '@resource/application/useCases/getResourcesByTopicId';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { Resource } from '@resource/domain/entities/resource';
import { mock, instance, verify, when } from 'ts-mockito';

describe('GetResourcesByTopicId UseCase', () => {
  let resourceRepository: IResourceRepository;
  let getResourcesByTopicId: GetResourcesByTopicId;
  
  beforeEach(() => {
    resourceRepository = mock<IResourceRepository>();
    getResourcesByTopicId = new GetResourcesByTopicId(instance(resourceRepository));
  });
  
  it('should return resources for a given topic id', async () => {
    const topicId = 'topic-id';
    const resources = [
      new Resource({
        id: 'resource-1',
        topicId,
        url: 'http://example1.com',
        description: 'Resource 1',
        type: 'article',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      new Resource({
        id: 'resource-2',
        topicId,
        url: 'http://example2.com',
        description: 'Resource 2',
        type: 'video',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ];
    
    when(resourceRepository.findByTopicId(topicId)).thenResolve(resources);
    
    const result = await getResourcesByTopicId.execute(topicId);
    
    verify(resourceRepository.findByTopicId(topicId)).once();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('resource-1');
    expect(result[1].id).toBe('resource-2');
    expect(result[0].topicId).toBe(topicId);
    expect(result[1].topicId).toBe(topicId);
  });
  
  it('should return empty array when no resources exist for the topic', async () => {
    const topicId = 'empty-topic-id';
    
    when(resourceRepository.findByTopicId(topicId)).thenResolve([]);
    
    const result = await getResourcesByTopicId.execute(topicId);
    
    verify(resourceRepository.findByTopicId(topicId)).once();
    expect(result).toHaveLength(0);
  });
});
