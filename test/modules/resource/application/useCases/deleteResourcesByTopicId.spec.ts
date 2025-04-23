import 'reflect-metadata';
import { DeleteResourcesByTopicId } from '@resource/application/useCases/deleteResourcesByTopicId';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { mock, instance, verify, when } from 'ts-mockito';

describe('DeleteResourcesByTopicId UseCase', () => {
  let resourceRepository: IResourceRepository;
  let deleteResourcesByTopicId: DeleteResourcesByTopicId;
  
  beforeEach(() => {
    resourceRepository = mock<IResourceRepository>();
    deleteResourcesByTopicId = new DeleteResourcesByTopicId(instance(resourceRepository));
  });
  
  it('should delete all resources by topic ID', async () => {
    // Arrange
    const topicId = 'topic-id';
    
    when(resourceRepository.deleteByTopicId(topicId)).thenResolve();
    
    // Act
    await deleteResourcesByTopicId.execute(topicId);
    
    // Assert
    verify(resourceRepository.deleteByTopicId(topicId)).once();
  });
});