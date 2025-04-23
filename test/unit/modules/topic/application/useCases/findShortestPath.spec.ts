import 'reflect-metadata';
import { FindShortestPath } from '@topic/application/useCases/findShortestPath';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { Topic } from '@topic/domain/entities/topic';
import { mock, instance, when, verify, anything } from 'ts-mockito';

describe('FindShortestPath', () => {
  let topicRepository: ITopicRepository;
  let findShortestPath: FindShortestPath;

  beforeEach(() => {
    topicRepository = mock<ITopicRepository>();
    findShortestPath = new FindShortestPath(instance(topicRepository));
  });

  it('should find direct path when start and end are the same', async () => {
    // Arrange
    const topicId = 'topic-id';
    
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
    when(topicRepository.findSubTopics(topicId)).thenResolve([]);

    // Act
    const result = await findShortestPath.execute(topicId, topicId);

    // Assert
    expect(result).toEqual([topicId]);
  });

  it('should find path between parent and child topic', async () => {
    // Arrange
    const parentId = 'parent-id';
    const childId = 'child-id';
    
    const parentTopic = new Topic({
      id: parentId,
      name: 'Parent Topic',
      content: 'Parent Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: undefined,
    });

    const childTopic = new Topic({
      id: childId,
      name: 'Child Topic',
      content: 'Child Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: parentId,
    });

    when(topicRepository.findById(parentId)).thenResolve(parentTopic);
    when(topicRepository.findSubTopics(parentId)).thenResolve([childTopic]);
    when(topicRepository.findById(childId)).thenResolve(childTopic);
    when(topicRepository.findSubTopics(childId)).thenResolve([]);

    // Act
    const result = await findShortestPath.execute(parentId, childId);

    // Assert
    expect(result).toEqual([parentId, childId]);
  });

  it('should return empty array if no path exists', async () => {
    // Arrange
    const startId = 'start-id';
    const endId = 'end-id';

    const startTopic = new Topic({
      id: startId,
      name: 'Start Topic',
      content: 'Start Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: undefined,
    });

    when(topicRepository.findById(startId)).thenResolve(startTopic);
    when(topicRepository.findSubTopics(startId)).thenResolve([]);
    when(topicRepository.findById(endId)).thenResolve(null);

    // Act
    const result = await findShortestPath.execute(startId, endId);

    // Assert
    expect(result).toEqual([]);
  });
});
