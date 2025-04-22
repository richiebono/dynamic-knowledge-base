import 'reflect-metadata';
import { TopicQueryHandler } from '@topic/application/handlers/topicQueryHandler';
import { GetTopicById } from '@topic/application/useCases/getTopicById';
import { GetTopicTree } from '@topic/application/useCases/getTopicTree';
import { FindShortestPath } from '@topic/application/useCases/findShortestPath';
import { GetAllTopics } from '@topic/application/useCases/getAllTopics';
import { GetTotalTopicsCount } from '@topic/application/useCases/getTotalTopicsCount';
import { TopicDTO } from '@topic/application/DTOs/topicDTO';
import { mock, instance, when, verify } from 'ts-mockito';

describe('TopicQueryHandler', () => {
  let getTopicById: GetTopicById;
  let getTopicTree: GetTopicTree;
  let findShortestPath: FindShortestPath;
  let getAllTopics: GetAllTopics;
  let getTotalTopicsCount: GetTotalTopicsCount;
  let handler: TopicQueryHandler;

  beforeEach(() => {
    getTopicById = mock(GetTopicById);
    getTopicTree = mock(GetTopicTree);
    findShortestPath = mock(FindShortestPath);
    getAllTopics = mock(GetAllTopics);
    getTotalTopicsCount = mock(GetTotalTopicsCount);
    
    handler = new TopicQueryHandler(
      instance(getTopicById),
      instance(getTopicTree),
      instance(findShortestPath),
      instance(getAllTopics),
      instance(getTotalTopicsCount)
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
});
