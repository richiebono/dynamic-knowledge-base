import 'reflect-metadata';
import { CreateTopic } from '@topic/application/useCases/createTopic';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { Topic } from '@topic/domain/entities/topic';
import { CreateTopicDTO } from '@topic/application/DTOs/topicDTO';
import { mock, instance, when, verify, anything, deepEqual, capture } from 'ts-mockito';

// Mock UUID to have predictable IDs in tests
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('CreateTopic', () => {
  let topicRepository: ITopicRepository;
  let createTopic: CreateTopic;
  const RealDate = Date;
  const mockDate = new Date('2025-04-22T21:54:49.790Z');

  beforeEach(() => {
    topicRepository = mock<ITopicRepository>();
    createTopic = new CreateTopic(instance(topicRepository));
    // Mock Date globally for all tests
    global.Date = class extends RealDate {
      constructor() {
        super();
        return mockDate;
      }
    } as any;
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  it('should create a topic with provided data', async () => {
    // Arrange
    const topicDTO: CreateTopicDTO = {
      name: 'New Topic',
      content: 'Topic Content',
      createdBy: 'user-id',
      parentTopicId: 'parent-id',
    };

    const expectedTopic = new Topic({
      id: 'mocked-uuid',
      name: topicDTO.name,
      content: topicDTO.content,
      parentTopicId: topicDTO.parentTopicId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      version: 1,
    });

    when(topicRepository.create(anything())).thenResolve(expectedTopic);

    // Act
    const result = await createTopic.execute(topicDTO);

    // Assert
    verify(topicRepository.create(anything())).once();
    expect(result).toEqual(expectedTopic);
    expect(result.id).toBe('mocked-uuid');
    expect(result.name).toBe(topicDTO.name);
    expect(result.content).toBe(topicDTO.content);
    expect(result.parentTopicId).toBe(topicDTO.parentTopicId);
    expect(result.version).toBe(1);
  });

  it('should create a topic without parent if parentTopicId is not provided', async () => {
    // Arrange
    const topicDTO: CreateTopicDTO = {
      name: 'Root Topic',
      content: 'Root Content',
      createdBy: 'user-id',
      parentTopicId: undefined,
    };

    const expectedTopic = new Topic({
      id: 'mocked-uuid',
      name: topicDTO.name,
      content: topicDTO.content,
      parentTopicId: undefined,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      version: 1,
    });

    when(topicRepository.create(anything())).thenResolve(expectedTopic);

    // Act
    const result = await createTopic.execute(topicDTO);

    // Assert
    verify(topicRepository.create(anything())).once();
    expect(result.parentTopicId).toBeUndefined();
  });

  it('should pass a Topic object to the repository', async () => {
    // Arrange
    const topicDTO: CreateTopicDTO = {
      name: 'New Topic',
      content: 'Topic Content',
      createdBy: 'user-id',
      parentTopicId: 'parent-id',
    };

    when(topicRepository.create(anything())).thenCall(topic => Promise.resolve(topic));

    // Act
    await createTopic.execute(topicDTO);

    // Assert
    verify(topicRepository.create(anything())).once();
    
    // Capture the argument passed to create() and check its properties
    const capturedArg = capture(topicRepository.create).last()[0];
    expect(capturedArg).toBeInstanceOf(Topic);
    expect(capturedArg.id).toBe('mocked-uuid');
    expect(capturedArg.name).toBe(topicDTO.name);
    expect(capturedArg.content).toBe(topicDTO.content);
    expect(capturedArg.parentTopicId).toBe(topicDTO.parentTopicId);
    expect(capturedArg.createdAt).toBe(mockDate);
    expect(capturedArg.updatedAt).toBe(mockDate);
    expect(capturedArg.version).toBe(1);
  });
});
