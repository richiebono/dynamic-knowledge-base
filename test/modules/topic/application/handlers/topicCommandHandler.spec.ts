import 'reflect-metadata';
import { TopicCommandHandler } from '@topic/application/handlers/topicCommandHandler';
import { CreateTopic } from '@topic/application/useCases/createTopic';
import { UpdateTopic } from '@topic/application/useCases/updateTopic';
import { DeleteTopic } from '@topic/application/useCases/deleteTopic';
import { CreateTopicDTO, UpdateTopicDTO } from '@topic/application/DTOs/topicDTO';
import { mock, instance, when, verify } from 'ts-mockito';
import { Topic } from '@topic/domain/entities/topic';

describe('TopicCommandHandler', () => {
  let createTopic: CreateTopic;
  let updateTopic: UpdateTopic;
  let deleteTopic: DeleteTopic;
  let handler: TopicCommandHandler;

  beforeEach(() => {
    createTopic = mock(CreateTopic);
    updateTopic = mock(UpdateTopic);
    deleteTopic = mock(DeleteTopic);
    
    handler = new TopicCommandHandler(
      instance(createTopic),
      instance(updateTopic),
      instance(deleteTopic)
    );
  });

  it('should create a topic', async () => {
    // Arrange
    const createTopicDTO: CreateTopicDTO = {
        name: 'New Topic',
        content: 'Topic Content',
        createdBy: 'user-id',
        parentTopicId: 'parent-id',
    };

    const createdTopic = new Topic({
        id: 'new-id',
        name: createTopicDTO.name,
        content: createTopicDTO.content,
        parentTopicId: createTopicDTO.parentTopicId,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
    });

    when(createTopic.execute(createTopicDTO)).thenResolve(createdTopic);

    // Act
    await handler.createTopic(createTopicDTO);

    // Assert
    verify(createTopic.execute(createTopicDTO)).once();
  });

  it('should update a topic', async () => {
    // Arrange
    const topicId = 'existing-id';
    const updateTopicDTO: UpdateTopicDTO = {
        name: 'Updated Topic',
        content: 'Updated Content',
        updatedBy: 'user-id',
        parentTopicId: 'parent-id',
    };

    when(updateTopic.execute(topicId, updateTopicDTO)).thenResolve();

    // Act
    await handler.updateTopic(topicId, updateTopicDTO);

    // Assert
    verify(updateTopic.execute(topicId, updateTopicDTO)).once();
  });

  it('should delete a topic', async () => {
    // Arrange
    const topicId = 'topic-to-delete';
    when(deleteTopic.execute(topicId)).thenResolve();

    // Act
    await handler.deleteTopic(topicId);

    // Assert
    verify(deleteTopic.execute(topicId)).once();
  });
});
