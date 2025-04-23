import 'reflect-metadata';
import { GetTopicHistory } from '@topic/application/useCases/getTopicHistory';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { Topic } from '@topic/domain/entities/topic';
import { TopicHistory } from '@topic/domain/entities/topicHistory';
import { mock, instance, when, verify } from 'ts-mockito';

describe('GetTopicHistory', () => {
  let topicRepository: ITopicRepository;
  let getTopicHistory: GetTopicHistory;

  beforeEach(() => {
    topicRepository = mock<ITopicRepository>();
    getTopicHistory = new GetTopicHistory(instance(topicRepository));
  });

  it('should return combined history including current version', async () => {
    // Arrange
    const topicId = 'topic-id';
    const currentDate = new Date('2025-04-23T10:00:00Z');
    const historyDate1 = new Date('2025-04-20T10:00:00Z');
    const historyDate2 = new Date('2025-04-15T10:00:00Z');
    
    const currentTopic = new Topic({
      id: topicId,
      name: 'Current Topic',
      content: 'Current Content',
      createdAt: new Date('2025-04-15T10:00:00Z'),
      updatedAt: currentDate,
      version: 3,
      parentTopicId: undefined
    });

    const topicHistory = [
      new TopicHistory({
        id: 'history-id-1',
        topicId: topicId,
        name: 'Topic Version 2',
        content: 'Content Version 2',
        version: 2,
        createdAt: historyDate1,
        parentTopicId: undefined
      }),
      new TopicHistory({
        id: 'history-id-2',
        topicId: topicId,
        name: 'Topic Version 1',
        content: 'Content Version 1',
        version: 1,
        createdAt: historyDate2,
        parentTopicId: undefined
      })
    ];

    when(topicRepository.findById(topicId)).thenResolve(currentTopic);
    when(topicRepository.getTopicHistory(topicId)).thenResolve(topicHistory);

    // Act
    const result = await getTopicHistory.execute(topicId);

    // Assert
    expect(result).toHaveLength(3); // 2 historical + 1 current
    expect(result).toEqual(expect.arrayContaining([
      { version: 3, createdAt: currentDate },
      { version: 2, createdAt: historyDate1 },
      { version: 1, createdAt: historyDate2 }
    ]));
    // Check that the result is sorted by version in descending order
    expect(result[0].version).toBe(3);
    expect(result[1].version).toBe(2);
    expect(result[2].version).toBe(1);
    
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.getTopicHistory(topicId)).once();
  });

  it('should return only current version if no history exists', async () => {
    // Arrange
    const topicId = 'topic-id';
    const currentDate = new Date('2025-04-23T10:00:00Z');
    
    const currentTopic = new Topic({
      id: topicId,
      name: 'Current Topic',
      content: 'Current Content',
      createdAt: new Date('2025-04-15T10:00:00Z'),
      updatedAt: currentDate,
      version: 1,
      parentTopicId: undefined
    });

    when(topicRepository.findById(topicId)).thenResolve(currentTopic);
    when(topicRepository.getTopicHistory(topicId)).thenResolve([]);

    // Act
    const result = await getTopicHistory.execute(topicId);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ version: 1, createdAt: currentDate });
    
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.getTopicHistory(topicId)).once();
  });

  it('should throw error if topic does not exist', async () => {
    // Arrange
    const topicId = 'non-existent-id';
    when(topicRepository.findById(topicId)).thenResolve(null);

    // Act & Assert
    await expect(getTopicHistory.execute(topicId)).rejects.toThrow('Topic not found');
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.getTopicHistory(topicId)).never();
  });

  it('should use createdAt if updatedAt is undefined', async () => {
    // Arrange
    const topicId = 'topic-id';
    const createdDate = new Date('2025-04-15T10:00:00Z');
    
    const currentTopic = new Topic({
      id: topicId,
      name: 'Current Topic',
      content: 'Current Content',
      createdAt: createdDate,
      updatedAt: undefined,
      version: 1,
      parentTopicId: undefined
    });

    when(topicRepository.findById(topicId)).thenResolve(currentTopic);
    when(topicRepository.getTopicHistory(topicId)).thenResolve([]);

    // Act
    const result = await getTopicHistory.execute(topicId);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ version: 1, createdAt: createdDate });
    
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.getTopicHistory(topicId)).once();
  });
});