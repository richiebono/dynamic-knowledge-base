import 'reflect-metadata';
import { ResourceRepository } from '@resource/infrastructure/repository/resourceRepository';
import { ResourceDbConnection } from '@resource/infrastructure/database/resourceDbConnection';
import { Resource } from '@resource/domain/entities/resource';
import { mock, instance, verify, when, anything } from 'ts-mockito';
import { QueryResult } from 'pg';

describe('ResourceRepository', () => {
  let dbConnection: ResourceDbConnection;
  let repository: ResourceRepository;
  
  beforeEach(() => {
    dbConnection = mock(ResourceDbConnection);
    repository = new ResourceRepository(instance(dbConnection));
  });

  it('should create a resource', async () => {
    // Arrange
    const resource = new Resource({
      id: 'resource-id',
      topicId: 'topic-id',
      url: 'http://example.com',
      description: 'Test resource',
      type: 'article',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const queryResult: QueryResult = {
      rows: [
        {
          id: resource.id,
          topicId: resource.topicId,
          url: resource.url,
          description: resource.description,
          type: resource.type,
          createdAt: resource.createdAt,
          updatedAt: resource.updatedAt,
        },
      ],
      command: 'INSERT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.create(resource);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeInstanceOf(Resource);
    expect(result.id).toBe(resource.id);
  });

  it('should update a resource', async () => {
    // Arrange
    const resource = new Resource({
      id: 'resource-id',
      topicId: 'topic-id',
      url: 'http://updated-example.com',
      description: 'Updated resource',
      type: 'video',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const queryResult: QueryResult = {
      rows: [
        {
          id: resource.id,
          topicId: resource.topicId,
          url: resource.url,
          description: resource.description,
          type: resource.type,
          updatedAt: resource.updatedAt,
        },
      ],
      command: 'UPDATE',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.update(resource);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeInstanceOf(Resource);
    expect(result.url).toBe('http://updated-example.com');
  });

  it('should delete a resource', async () => {
    // Arrange
    const resourceId = 'resource-id';
    when(dbConnection.query(anything(), anything())).thenResolve({ 
      rows: [],
      command: 'DELETE',
      rowCount: 1,
      oid: 0,
      fields: [],
    });

    // Act
    await repository.delete(resourceId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
  });

  it('should delete all resources by topic id', async () => {
    // Arrange
    const topicId = 'topic-id';
    when(dbConnection.query(anything(), anything())).thenResolve({ 
      rows: [],
      command: 'DELETE',
      rowCount: 2,
      oid: 0,
      fields: [],
    });

    // Act
    await repository.deleteByTopicId(topicId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
  });

  it('should find a resource by id', async () => {
    // Arrange
    const resourceId = 'resource-id';
    const queryResult: QueryResult = {
      rows: [
        {
          id: resourceId,
          topicId: 'topic-id',
          url: 'http://example.com',
          description: 'Test resource',
          type: 'article',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.findById(resourceId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeInstanceOf(Resource);
    expect(result?.id).toBe(resourceId);
  });

  it('should return null when resource not found by id', async () => {
    // Arrange
    const resourceId = 'non-existent-id';
    when(dbConnection.query(anything(), anything())).thenResolve({ 
      rows: [],
      command: 'SELECT',
      rowCount: 0,
      oid: 0,
      fields: [],
    });

    // Act
    const result = await repository.findById(resourceId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toBeNull();
  });

  it('should find all resources', async () => {
    // Arrange
    const queryResult: QueryResult = {
      rows: [
        {
          id: 'resource-1',
          topicId: 'topic-id',
          url: 'http://example1.com',
          description: 'Resource 1',
          type: 'article',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'resource-2',
          topicId: 'topic-id',
          url: 'http://example2.com',
          description: 'Resource 2',
          type: 'video',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      command: 'SELECT',
      rowCount: 2,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything())).thenResolve(queryResult);

    // Act
    const result = await repository.findAll();

    // Assert
    verify(dbConnection.query(anything())).once();
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Resource);
    expect(result[1]).toBeInstanceOf(Resource);
  });

  it('should find resources by topic id', async () => {
    // Arrange
    const topicId = 'topic-id';
    const queryResult: QueryResult = {
      rows: [
        {
          id: 'resource-1',
          topicId: topicId,
          url: 'http://example1.com',
          description: 'Resource 1',
          type: 'article',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.findByTopicId(topicId);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Resource);
    expect(result[0].topicId).toBe(topicId);
  });

  it('should find paginated resources', async () => {
    // Arrange
    const limit = 10;
    const offset = 0;
    const orderBy = 'createdAt';
    const orderDirection = 'DESC';

    const queryResult: QueryResult = {
      rows: [
        {
          id: 'resource-1',
          topicId: 'topic-id',
          url: 'http://example1.com',
          description: 'Resource 1',
          type: 'article',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything(), anything())).thenResolve(queryResult);

    // Act
    const result = await repository.findAllPaginated(limit, offset, orderBy, orderDirection);

    // Assert
    verify(dbConnection.query(anything(), anything())).once();
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Resource);
  });

  it('should get total resource count', async () => {
    // Arrange
    const count = 42;
    const queryResult: QueryResult = {
      rows: [{ count: count.toString() }],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    };

    when(dbConnection.query(anything())).thenResolve(queryResult);

    // Act
    const result = await repository.getTotalResourceCount();

    // Assert
    verify(dbConnection.query(anything())).once();
    expect(result).toBe(count);
  });
});
