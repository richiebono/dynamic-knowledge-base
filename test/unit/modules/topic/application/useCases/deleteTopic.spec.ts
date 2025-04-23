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

  it('should throw error if topic has child topics', async () => {
    // Arrange
    const topicId = 'parent-topic-id';
    const mockTopic = new Topic({
      id: topicId,
      name: 'Parent Topic',
      content: 'Parent Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: undefined,
    });

    const childTopics = [
      new Topic({
        id: 'child-topic-id',
        name: 'Child Topic',
        content: 'Child Content',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        parentTopicId: topicId,
      })
    ];

    when(topicRepository.findById(topicId)).thenResolve(mockTopic);
    when(topicRepository.findByParentId(topicId)).thenResolve(childTopics);

    // Act & Assert
    await expect(deleteTopic.execute(topicId)).rejects.toThrow(
      `Cannot delete topic with id ${topicId} because it has child topics. Delete all child topics first.`
    );
    
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.findByParentId(topicId)).once();
    verify(resourceCommandHandler.deleteResourcesByTopicId(topicId)).never();
    verify(topicRepository.delete(topicId)).never();
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
    when(topicRepository.findByParentId(topicId)).thenResolve([]); // No child topics
    when(topicRepository.delete(topicId)).thenResolve();
    when(resourceCommandHandler.deleteResourcesByTopicId(topicId)).thenResolve();

    // Act
    await deleteTopic.execute(topicId);

    // Assert
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.findByParentId(topicId)).once();
    verify(resourceCommandHandler.deleteResourcesByTopicId(topicId)).once();
    verify(topicRepository.delete(topicId)).once();
  });
});
