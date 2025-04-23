import 'reflect-metadata';
import { DeleteTopic } from '@topic/application/useCases/deleteTopic';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { IResourceCommandHandler } from '@resource/application/interfaces/resourceCommandHandler';
import { Topic } from '@topic/domain/entities/topic';
import { mock, instance, when, verify, anything } from 'ts-mockito';

describe('DeleteTopic', () => {
  let topicRepository: ITopicRepository;
  let resourceCommandHandler: IResourceCommandHandler;
  let deleteTopic: DeleteTopic;

  beforeEach(() => {
    topicRepository = mock<ITopicRepository>();
    resourceCommandHandler = mock<IResourceCommandHandler>();
    deleteTopic = new DeleteTopic(instance(topicRepository), instance(resourceCommandHandler));
  });

  it('should throw error if topic does not exist', async () => {
    // Arrange
    const topicId = 'non-existent-id';
    when(topicRepository.findById(anything())).thenResolve(null);

    // Act & Assert
    await expect(deleteTopic.execute(topicId)).rejects.toThrow(`Topic with id ${topicId} not found`);
    verify(topicRepository.findById(topicId)).once();
    verify(resourceCommandHandler.deleteResourcesByTopicId(topicId)).never();
  });

  it('should delete a topic and its associated resources if it exists', async () => {
    // Arrange
    const topicId = 'existing-id';
    const mockTopic = new Topic({
      id: topicId,
      name: 'Test Topic',
      content: 'Test Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: undefined,
    });

    when(topicRepository.findById(topicId)).thenResolve(mockTopic);
    when(topicRepository.delete(topicId)).thenResolve();
    when(resourceCommandHandler.deleteResourcesByTopicId(topicId)).thenResolve();

    // Act
    await deleteTopic.execute(topicId);

    // Assert
    verify(topicRepository.findById(topicId)).once();
    verify(resourceCommandHandler.deleteResourcesByTopicId(topicId)).once();
    verify(topicRepository.delete(topicId)).once();
  });
});
