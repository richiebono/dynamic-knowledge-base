import 'reflect-metadata';
import { UpdateTopic } from '@topic/application/useCases/updateTopic';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { Topic } from '@topic/domain/entities/topic';
import { UpdateTopicDTO } from '@topic/application/DTOs/topicDTO';
import { mock, instance, when, verify, anything } from 'ts-mockito';

describe('UpdateTopic', () => {
  let topicRepository: ITopicRepository;
  let updateTopic: UpdateTopic;

  beforeEach(() => {
    topicRepository = mock<ITopicRepository>();
    updateTopic = new UpdateTopic(instance(topicRepository));
  });

  it('should throw an error if topic is not found', async () => {
    // Arrange
    const topicId = 'non-existent-id';
    const updateTopicDTO: UpdateTopicDTO = {
        name: 'Updated Name',
        content: 'Updated Content',
        updatedBy: 'user-id',
        parentTopicId: 'new-parent-id'
    };
    
    when(topicRepository.findById(topicId)).thenResolve(null);

    // Act & Assert
    await expect(updateTopic.execute(topicId, updateTopicDTO)).rejects.toThrow('Topic not found');
    verify(topicRepository.findById(topicId)).once();
  });

  it('should update a topic with new data', async () => {
    // Arrange
    const topicId = 'existing-id';
    const existingTopic = new Topic({
      id: topicId,
      name: 'Original Name',
      content: 'Original Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: undefined
    });

    const updateTopicDTO: UpdateTopicDTO = {
        id: topicId,  
        name: 'Updated Name',
        content: 'Updated Content',
        updatedBy: 'user-id',
        parentTopicId: 'new-parent-id'
    };

    const updatedTopic = new Topic({
      id: topicId,
      name: updateTopicDTO.name || existingTopic.name,
      content: updateTopicDTO.content || existingTopic.content,
      createdAt: existingTopic.createdAt,
      updatedAt: expect.any(Date),
      version: existingTopic.version + 1,
      parentTopicId: updateTopicDTO.parentTopicId
    });
    
    when(topicRepository.findById(topicId)).thenResolve(existingTopic);
    when(topicRepository.update(anything())).thenResolve(updatedTopic);

    // Act
    const result = await updateTopic.execute(topicId, updateTopicDTO);

    // Assert
    verify(topicRepository.findById(topicId)).once();
    verify(topicRepository.update(anything())).once();
    
    expect(result).toBe(updatedTopic);
    expect(result.name).toBe(updateTopicDTO.name);
    expect(result.content).toBe(updateTopicDTO.content);
    expect(result.parentTopicId).toBe(updateTopicDTO.parentTopicId);
  });

  it('should only update provided fields', async () => {
    // Arrange
    const topicId = 'existing-id';
    const existingTopic = new Topic({
      id: topicId,
      name: 'Original Name',
      content: 'Original Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: 'original-parent-id'
    });

    const updateTopicDTO: UpdateTopicDTO = {
      name: 'Updated Name',
      updatedBy: 'user-id',
    };

    const updatedTopic = new Topic({
      id: topicId,
      name: updateTopicDTO.name || existingTopic.name,
      content: existingTopic.content, 
      createdAt: existingTopic.createdAt,
      updatedAt: expect.any(Date),
      version: existingTopic.version + 1,
      parentTopicId: existingTopic.parentTopicId
    });
    
    when(topicRepository.findById(topicId)).thenResolve(existingTopic);
    when(topicRepository.update(anything())).thenResolve(updatedTopic);

    // Act
    const result = await updateTopic.execute(topicId, updateTopicDTO);

    // Assert
    verify(topicRepository.update(anything())).once();
    expect(result.name).toBe(updateTopicDTO.name);
    expect(result.content).toBe(existingTopic.content);
    expect(result.parentTopicId).toBe(existingTopic.parentTopicId);
  });
});
