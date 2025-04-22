import 'reflect-metadata';
import { GetTopicById } from '@topic/application/useCases/getTopicById';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { Topic } from '@topic/domain/entities/topic';
import { mock, instance, when, verify, anything } from 'ts-mockito';

describe('GetTopicById', () => {
  let topicRepository: ITopicRepository;
  let getTopicById: GetTopicById;

  beforeEach(() => {
    topicRepository = mock<ITopicRepository>();
    getTopicById = new GetTopicById(instance(topicRepository));
  });

  it('should throw an error if topic ID is not provided', async () => {
    // Act & Assert
    await expect(getTopicById.execute('')).rejects.toThrow('Topic ID is required');
  });

  it('should throw an error if topic is not found', async () => {
    // Arrange
    const topicId = 'non-existent-id';
    when(topicRepository.findById(anything())).thenResolve(null);

    // Act & Assert
    await expect(getTopicById.execute(topicId)).rejects.toThrow('Topic not found');
    verify(topicRepository.findById(topicId)).once();
  });

  it('should return topic if found', async () => {
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

    when(topicRepository.findById(anything())).thenResolve(mockTopic);

    // Act
    const result = await getTopicById.execute(topicId);

    // Assert
    verify(topicRepository.findById(topicId)).once();
    expect(result).toBe(mockTopic);
    expect(result.id).toBe(topicId);
  });
});
