import 'reflect-metadata';
import { GetTopicTree } from '@topic/application/useCases/getTopicTree';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { Topic } from '@topic/domain/entities/topic';
import { mock, instance, when, verify, anything } from 'ts-mockito';

describe('GetTopicTree', () => {
  let topicRepository: ITopicRepository;
  let getTopicTree: GetTopicTree;

  beforeEach(() => {
    topicRepository = mock<ITopicRepository>();
    getTopicTree = new GetTopicTree(instance(topicRepository));
  });

  it('should throw an error if topic is not found', async () => {
    // Arrange
    const topicId = 'non-existent-id';
    when(topicRepository.findById(topicId)).thenResolve(null);

    // Act & Assert
    await expect(getTopicTree.execute(topicId)).rejects.toThrow('Topic not found');
    verify(topicRepository.findById(topicId)).once();
  });

  it('should return a topic tree with no children', async () => {
    // Arrange
    const topicId = 'topic-id';
    const topic = new Topic({
      id: topicId,
      name: 'Test Topic',
      content: 'Test Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: undefined
    });
    
    when(topicRepository.findById(topicId)).thenResolve(topic);
    when(topicRepository.findSubTopics(topicId)).thenResolve([]);

    // Act
    const result = await getTopicTree.execute(topicId);

    // Assert
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.findSubTopics(topicId)).once();
    
    expect(result.id).toBe(topicId);
    expect(result.name).toBe(topic.name);
    expect(result.content).toBe(topic.content);
    expect(result.subTopics).toEqual([]);
  });

  it('should build a hierarchical topic tree', async () => {
    // Arrange
    const rootId = 'root-id';
    const childId1 = 'child-id-1';
    const childId2 = 'child-id-2';
    const grandchildId = 'grandchild-id';
    
    const rootTopic = new Topic({
      id: rootId,
      name: 'Root Topic',
      content: 'Root Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: undefined
    });
    
    const childTopic1 = new Topic({
      id: childId1,
      name: 'Child Topic 1',
      content: 'Child Content 1',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: rootId
    });
    
    const childTopic2 = new Topic({
      id: childId2,
      name: 'Child Topic 2',
      content: 'Child Content 2',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: rootId
    });
    
    const grandchildTopic = new Topic({
      id: grandchildId,
      name: 'Grandchild Topic',
      content: 'Grandchild Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: childId1
    });
    
    when(topicRepository.findById(rootId)).thenResolve(rootTopic);
    when(topicRepository.findSubTopics(rootId)).thenResolve([childTopic1, childTopic2]);
    when(topicRepository.findSubTopics(childId1)).thenResolve([grandchildTopic]);
    when(topicRepository.findSubTopics(childId2)).thenResolve([]);
    when(topicRepository.findSubTopics(grandchildId)).thenResolve([]);

    // Act
    const result = await getTopicTree.execute(rootId);

    // Assert
    verify(topicRepository.findById(rootId)).once();
    verify(topicRepository.findSubTopics(rootId)).once();
    verify(topicRepository.findSubTopics(childId1)).once();
    verify(topicRepository.findSubTopics(childId2)).once();
    
    expect(result.id).toBe(rootId);
    expect(result.subTopics?.length).toBe(2);
    expect(result.subTopics?.[0].id).toBe(childId1);
    expect(result.subTopics?.[1].id).toBe(childId2);
    expect(result.subTopics?.[0].subTopics?.length).toBe(1);
    expect(result.subTopics?.[0].subTopics?.[0].id).toBe(grandchildId);
  });
});
