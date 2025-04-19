import { injectable, inject } from 'inversify';
import { Topic } from '../../domain/entities/topic';
import { ITopicRepository } from '../../domain/interfaces/topicRepository';
import { TopicDbConnection } from '../database/topicDbConnection';

@injectable()
export class TopicRepository implements ITopicRepository {
    constructor(@inject(TopicDbConnection) private dbConnection: TopicDbConnection) {}

    async findSubTopics(currentId: string): Promise<Topic[]> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; parentTopicId: string; createdAt: Date; version: number }>(
            'SELECT id, name, content, parentTopicId, createdAt, version FROM topics WHERE parentTopicId = $1',
            [currentId]
        );
        return result.rows.map(this.mapToTopic);
    }

    async findVersionById(id: string, version: number): Promise<Topic | null> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; version: number; createdAt: Date; updatedAt: Date }>(
            'SELECT id, name, content, version, createdAt, updatedAt FROM topics WHERE id = $1 AND version = $2',
            [id, version]
        );
        return result.rows.length ? this.mapToTopic(result.rows[0]) : null;
    }

    async create(topic: Topic): Promise<Topic> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; createdAt: Date; updatedAt: Date; version: number; parentTopicId?: string }>(
            'INSERT INTO topics (name, content, createdAt, updatedAt, version, parentTopicId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, content, createdAt, updatedAt, version, parentTopicId',
            [topic.name, topic.content, topic.createdAt, topic.updatedAt, topic.version, topic.parentTopicId]
        );
        return this.mapToTopic(result.rows[0]);
    }

    async update(topic: Topic): Promise<Topic> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; updatedAt: Date; version: number; parentTopicId?: string }>(
            'UPDATE topics SET name = $1, content = $2, updatedAt = $3, version = $4, parentTopicId = $5 WHERE id = $6 RETURNING id, name, content, updatedAt, version, parentTopicId',
            [topic.name, topic.content, topic.updatedAt, topic.version, topic.parentTopicId, topic.id]
        );
        return this.mapToTopic(result.rows[0]);
    }

    async findById(id: string): Promise<Topic | null> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; createdAt: Date; updatedAt: Date; version: number; parentTopicId?: string }>(
            'SELECT id, name, content, createdAt, updatedAt, version, parentTopicId FROM topics WHERE id = $1',
            [id]
        );
        return result.rows.length ? this.mapToTopic(result.rows[0]) : null;
    }

    async findAll(): Promise<Topic[]> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; createdAt: Date; updatedAt: Date; version: number; parentTopicId?: string }>(
            'SELECT id, name, content, createdAt, updatedAt, version, parentTopicId FROM topics'
        );
        return result.rows.map(this.mapToTopic);
    }

    async delete(id: string): Promise<void> {
        await this.dbConnection.query('DELETE FROM topics WHERE id = $1', [id]);
    }

    async findByParentId(parentId: string): Promise<Topic[]> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; parentTopicId: string; createdAt: Date; version: number }>(
            'SELECT id, name, content, parentTopicId, createdAt, version FROM topics WHERE parentTopicId = $1',
            [parentId]
        );
        return result.rows.map(this.mapToTopic);
    }

    async findByVersion(id: string, version: number): Promise<Topic | null> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; version: number; createdAt: Date }>(
            'SELECT * FROM topics WHERE id = $1 AND version = $2',
            [id, version]
        );
        return result.rows.length ? this.mapToTopic(result.rows[0]) : null;
    }

    private mapToTopic(row: { id: string; name: string; content: string; createdAt?: Date; updatedAt?: Date; version: number; parentTopicId?: string }): Topic {
        return new Topic({
            id: row.id,
            name: row.name,
            content: row.content,
            createdAt: row.createdAt ?? new Date(),
            updatedAt: row.updatedAt,
            version: row.version,
            parentTopicId: row.parentTopicId,
        });
    }
}