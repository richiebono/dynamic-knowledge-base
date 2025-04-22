import 'reflect-metadata';
import { TopicRepository } from '@topic/infrastructure/repository/topicRepository';
import { TopicDbConnection } from '@topic/infrastructure/database/topicDbConnection';
import { Topic } from '@topic/domain/entities/topic';
import { mock, instance, verify, when, anything } from 'ts-mockito';
import { QueryResult } from 'pg';

describe('TopicRepository', () => {
  let dbConnection: TopicDbConnection;
  let repository: TopicRepository;
  
  beforeEach(() => {
    dbConnection = mock(TopicDbConnection);
    repository = new TopicRepository(instance(dbConnection));
  });

  it('should create a topic', async () => {
    // Arrange
    const topic = new Topic({
      id: 'topic-id',
      name: 'Test Topic',
      content: 'Test content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      parentTopicId: 'parent-id'
    });

    const queryResult: QueryResult = {
      rows: [
        {
          id: topic.id,
          name: topic.name,
          content: topic.content,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
          version: topic.version,
          parentTopicId: topic.parentTopicId
        },
      ],
      command: 'INSERT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.create(topic);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeInstanceOf(Topic);
    expect(result.id).toBe(topic.id);
    expect(result.name).toBe(topic.name);
    expect(result.content).toBe(topic.content);
  });

  it('should update a topic', async () => {
    // Arrange
    const topic = new Topic({
      id: 'topic-id',
      name: 'Updated Topic',
      content: 'Updated content',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 2,
      parentTopicId: 'parent-id'
    });

    const queryResult: QueryResult = {
      rows: [
        {
          id: topic.id,
          name: topic.name,
          content: topic.content,
          updatedAt: topic.updatedAt,
          version: topic.version,
          parentTopicId: topic.parentTopicId
        },
      ],
      command: 'UPDATE',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.update(topic);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeInstanceOf(Topic);
    expect(result.name).toBe('Updated Topic');
    expect(result.version).toBe(2);
  });

  it('should find a topic by id', async () => {
    // Arrange
    const topicId = 'topic-id';
    const queryResult: QueryResult = {
      rows: [
        {
          id: topicId,
          name: 'Test Topic',
          content: 'Test content',
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          parentTopicId: 'parent-id'
        },
      ],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.findById(topicId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeInstanceOf(Topic);
    expect(result?.id).toBe(topicId);
  });

  it('should return null when topic not found by id', async () => {
    // Arrange
    const topicId = 'non-existent-id';
    when(dbConnection.query(anything(), anything())).thenResolve({ 
      rows: [],
      command: 'SELECT',
      rowCount: 0,
      oid: 0,
      fields: [],
    });

    // Act
    const result = await repository.findById(topicId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeNull();
  });

  it('should find all topics', async () => {
    // Arrange
    const queryResult: QueryResult = {
      rows: [
        {
          id: 'topic-1',
          name: 'Topic 1',
          content: 'Content 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          parentTopicId: null
        },
        {
          id: 'topic-2',
          name: 'Topic 2',
          content: 'Content 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          parentTopicId: 'topic-1'
        },
      ],
      command: 'SELECT',
      rowCount: 2,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.findAll();

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Topic);
    expect(result[1]).toBeInstanceOf(Topic);
  });

  it('should delete a topic', async () => {
    // Arrange
    const topicId = 'topic-id';
    when(dbConnection.query(anything(), anything())).thenResolve({ 
      rows: [],
      command: 'DELETE',
      rowCount: 1,
      oid: 0,
      fields: [],
    });

    // Act
    await repository.delete(topicId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
  });

  it('should find sub-topics', async () => {
    // Arrange
    const parentId = 'parent-id';
    const queryResult: QueryResult = {
      rows: [
        {
          id: 'child-1',
          name: 'Child Topic 1',
          content: 'Child Content 1',
          createdAt: new Date(),
          parentTopicId: parentId,
          version: 1
        },
        {
          id: 'child-2',
          name: 'Child Topic 2',
          content: 'Child Content 2',
          createdAt: new Date(),
          parentTopicId: parentId,
          version: 1
        },
      ],
      command: 'SELECT',
      rowCount: 2,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.findSubTopics(parentId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toHaveLength(2);
    expect(result[0].parentTopicId).toBe(parentId);
    expect(result[1].parentTopicId).toBe(parentId);
  });

  it('should find a topic by version', async () => {
    // Arrange
    const topicId = 'topic-id';
    const version = 2;
    const queryResult: QueryResult = {
      rows: [
        {
          id: topicId,
          name: 'Test Topic v2',
          content: 'Version 2 content',
          createdAt: new Date(),
          updatedAt: new Date(),
          version: version
        },
      ],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.findVersionById(topicId, version);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeInstanceOf(Topic);
    expect(result?.id).toBe(topicId);
    expect(result?.version).toBe(version);
  });

  it('should get paginated topics', async () => {
    // Arrange
    const limit = 10;
    const offset = 0;
    const orderBy = 'createdAt';
    const orderDirection = 'DESC';

    const queryResult: QueryResult = {
      rows: [
        {
          id: 'topic-1',
          name: 'Topic 1',
          content: 'Content 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          parentTopicId: null
        },
      ],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.getPaginatedTopics(limit, offset, orderBy, orderDirection);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Topic);
  });

  it('should get total topics count', async () => {
    // Arrange
    const count = 42;
    const queryResult: QueryResult = {
      rows: [{ count: count.toString() }],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.getTotalTopicsCount();

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBe(count);
  });
});
