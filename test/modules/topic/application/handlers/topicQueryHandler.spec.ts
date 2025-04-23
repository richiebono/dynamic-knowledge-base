import 'reflect-metadata';
import { TopicQueryHandler } from '@topic/application/handlers/topicQueryHandler';
import { GetTopicById } from '@topic/application/useCases/getTopicById';
import { GetTopicTree } from '@topic/application/useCases/getTopicTree';
import { FindShortestPath } from '@topic/application/useCases/findShortestPath';
import { GetAllTopics } from '@topic/application/useCases/getAllTopics';
import { GetTotalTopicsCount } from '@topic/application/useCases/getTotalTopicsCount';
import { GetTopicVersion } from '@topic/application/useCases/getTopicVersion';
import { GetTopicHistory } from '@topic/application/useCases/getTopicHistory';
import { TopicDTO } from '@topic/application/DTOs/topicDTO';
import { mock, instance, when, verify } from 'ts-mockito';

describe('TopicQueryHandler', () => {
  let getTopicById: GetTopicById;
  let getTopicTree: GetTopicTree;
  let findShortestPath: FindShortestPath;
  let getAllTopics: GetAllTopics;
  let getTotalTopicsCount: GetTotalTopicsCount;
  let getTopicVersion: GetTopicVersion;
  let getTopicHistory: GetTopicHistory;
  let handler: TopicQueryHandler;

  beforeEach(() => {
    getTopicById = mock(GetTopicById);
    getTopicTree = mock(GetTopicTree);
    findShortestPath = mock(FindShortestPath);
    getAllTopics = mock(GetAllTopics);
    getTotalTopicsCount = mock(GetTotalTopicsCount);
    getTopicVersion = mock(GetTopicVersion);
    getTopicHistory = mock(GetTopicHistory);
    
    handler = new TopicQueryHandler(
      instance(getTopicById),
      instance(getTopicTree),
      instance(findShortestPath),
      instance(getAllTopics),
      instance(getTotalTopicsCount),
      instance(getTopicVersion),
      instance(getTopicHistory)
    );
  });

  it('should get topic by ID', async () => {
    // Arrange
    const topicId = 'test-id';
    const mockTopicDTO: TopicDTO = {
      id: topicId,
      name: 'Test Topic',
      content: 'Test Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: undefined,
    };

    when(getTopicById.execute(topicId)).thenResolve(mockTopicDTO);

    // Act
    const result = await handler.getTopicById(topicId);

    // Assert
    expect(result).toEqual(mockTopicDTO);
    verify(getTopicById.execute(topicId)).once();
  });

  it('should get topic version', async () => {
    // Arrange
    const topicId = 'test-id';
    const version = 1;
    const mockTopicDTO: TopicDTO = {
      id: topicId,
      name: 'Test Topic V1',
      content: 'Test Content V1',
      createdAt: new Date(),
      version: version,
      parentTopicId: undefined,
    };

    when(getTopicVersion.execute(topicId, version)).thenResolve(mockTopicDTO);

    // Act
    const result = await handler.getTopicVersion(topicId, version);

    // Assert
    expect(result).toEqual(mockTopicDTO);
    verify(getTopicVersion.execute(topicId, version)).once();
  });

  it('should get topic history', async () => {
    // Arrange
    const topicId = 'test-id';
    const mockHistory = [
      { version: 2, createdAt: new Date('2025-04-20') },
      { version: 1, createdAt: new Date('2025-04-10') }
    ];

    when(getTopicHistory.execute(topicId)).thenResolve(mockHistory);

    // Act
    const result = await handler.getTopicHistory(topicId);

    // Assert
    expect(result).toEqual(mockHistory);
    verify(getTopicHistory.execute(topicId)).once();
  });
});
