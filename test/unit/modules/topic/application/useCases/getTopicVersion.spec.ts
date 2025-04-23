import 'reflect-metadata';
import { GetTopicVersion } from '@topic/application/useCases/getTopicVersion';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { Topic } from '@topic/domain/entities/topic';
import { TopicHistory } from '@topic/domain/entities/topicHistory';
import { mock, instance, when, verify } from 'ts-mockito';

describe('GetTopicVersion', () => {
  let topicRepository: ITopicRepository;
  let getTopicVersion: GetTopicVersion;

  beforeEach(() => {
    topicRepository = mock<ITopicRepository>();
    getTopicVersion = new GetTopicVersion(instance(topicRepository));
  });

  it('should return current topic if version matches current version', async () => {
    // Arrange
    const topicId = 'topic-id';
    const version = 2;
    const currentTopic = new Topic({
      id: topicId,
      name: 'Current Topic',
      content: 'Current Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: version,
      parentTopicId: undefined
    });

    when(topicRepository.findById(topicId)).thenResolve(currentTopic);

    // Act
    const result = await getTopicVersion.execute(topicId, version);

    // Assert
    expect(result).toEqual({
      id: topicId,
      name: 'Current Topic',
      content: 'Current Content',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      version: version,
      parentTopicId: undefined
    });
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.getTopicVersion(topicId, version)).never();
  });

  it('should return historic version if version is different from current', async () => {
    // Arrange
    const topicId = 'topic-id';
    const currentVersion = 2;
    const requestedVersion = 1;
    
    const currentTopic = new Topic({
      id: topicId,
      name: 'Current Topic',
      content: 'Current Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: currentVersion,
      parentTopicId: undefined
    });

    const historicVersion = new TopicHistory({
      id: 'history-id',
      topicId: topicId,
      name: 'Historic Topic',
      content: 'Historic Content',
      version: requestedVersion,
      createdAt: new Date(),
      parentTopicId: undefined
    });

    when(topicRepository.findById(topicId)).thenResolve(currentTopic);
    when(topicRepository.getTopicVersion(topicId, requestedVersion)).thenResolve(historicVersion);

    // Act
    const result = await getTopicVersion.execute(topicId, requestedVersion);

    // Assert
    expect(result).toEqual({
      id: topicId,
      name: 'Historic Topic',
      content: 'Historic Content',
      createdAt: expect.any(Date),
      version: requestedVersion,
      parentTopicId: undefined
    });
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.getTopicVersion(topicId, requestedVersion)).once();
  });

  it('should throw error if topic does not exist', async () => {
    // Arrange
    const topicId = 'non-existent-id';
    const version = 1;
    
    when(topicRepository.findById(topicId)).thenResolve(null);

    // Act & Assert
    await expect(getTopicVersion.execute(topicId, version)).rejects.toThrow('Topic not found');
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.getTopicVersion(topicId, version)).never();
  });

  it('should throw error if requested version does not exist', async () => {
    // Arrange
    const topicId = 'topic-id';
    const currentVersion = 3;
    const requestedVersion = 1;
    
    const currentTopic = new Topic({
      id: topicId,
      name: 'Current Topic',
      content: 'Current Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: currentVersion,
      parentTopicId: undefined
    });

    when(topicRepository.findById(topicId)).thenResolve(currentTopic);
    when(topicRepository.getTopicVersion(topicId, requestedVersion)).thenResolve(null);

    // Act & Assert
    await expect(getTopicVersion.execute(topicId, requestedVersion)).rejects.toThrow(`Version ${requestedVersion} not found for topic ${topicId}`);
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.getTopicVersion(topicId, requestedVersion)).once();
  });
});