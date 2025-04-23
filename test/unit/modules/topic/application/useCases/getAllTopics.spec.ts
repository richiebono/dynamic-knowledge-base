import 'reflect-metadata';
import { GetAllTopics } from '@topic/application/useCases/getAllTopics';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { Topic } from '@topic/domain/entities/topic';
import { mock, instance, when, verify, anything } from 'ts-mockito';

describe('GetAllTopics', () => {
  let topicRepository: ITopicRepository;
  let getAllTopics: GetAllTopics;

  beforeEach(() => {
    topicRepository = mock<ITopicRepository>();
    getAllTopics = new GetAllTopics(instance(topicRepository));
  });

  it('should return an array of topic DTOs', async () => {
    // Arrange
    const mockTopics = [
      new Topic({
        id: 'topic-1',
        name: 'Topic 1',
        content: 'Content 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        parentTopicId: undefined,
      }),
      new Topic({
        id: 'topic-2',
        name: 'Topic 2',
        content: 'Content 2',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        parentTopicId: 'topic-1',
      }),
    ];

    const limit = 10;
    const offset = 0;
    const orderBy = 'createdAt';
    const orderDirection = 'DESC';

    when(topicRepository.getPaginatedTopics(anything(), anything(), anything(), anything()))
      .thenResolve(mockTopics);

    // Act
    const result = await getAllTopics.execute(limit, offset, orderBy, orderDirection);

    // Assert
    verify(topicRepository.getPaginatedTopics(limit, offset, orderBy, orderDirection)).once();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('topic-1');
    expect(result[1].id).toBe('topic-2');
    expect(result[0].name).toBe('Topic 1');
    expect(result[1].name).toBe('Topic 2');
  });

  it('should map Topic entities to DTOs correctly', async () => {
    // Arrange
    const mockTopic = new Topic({
      id: 'topic-1',
      name: 'Topic 1',
      content: 'Content 1',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: 'parent-id',
    });

    when(topicRepository.getPaginatedTopics(anything(), anything(), anything(), anything()))
      .thenResolve([mockTopic]);

    // Act
    const result = await getAllTopics.execute(10, 0, 'createdAt', 'ASC');

    // Assert
    expect(result[0]).toEqual({
      id: mockTopic.id,
      name: mockTopic.name,
      content: mockTopic.content,
      createdAt: mockTopic.createdAt,
      updatedAt: mockTopic.updatedAt,
      version: mockTopic.version,
      parentTopicId: mockTopic.parentTopicId,
    });
  });
});
