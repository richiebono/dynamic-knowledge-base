import { injectable, inject } from 'inversify';
import { Topic } from '@topic/domain/entities/topic';
import { TopicHistory } from '@topic/domain/entities/topicHistory';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { TopicDbConnection } from '@topic/infrastructure/database/topicDbConnection';

@injectable()
export class TopicRepository implements ITopicRepository {
    constructor(@inject(TopicDbConnection) private dbConnection: TopicDbConnection) {}

    async findSubTopics(currentId: string): Promise<Topic[]> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; parentTopicId: string; createdAt: Date; version: number }>(
            'SELECT id, name, content, parentTopicId, createdAt, version FROM topics WHERE parentTopicId = $1',
            [currentId]
        );
        return result.rows.map(row => this.mapToTopic(row));
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
            'SELECT id, name, content, createdAt, updatedAt, version, parentTopicId FROM topics',
            []
        );
        
        if (!result || !result.rows) {
            return [];
        }
        
        return result.rows.map(row => this.mapToTopic(row));
    }

    async delete(id: string): Promise<void> {
        await this.dbConnection.query('DELETE FROM topics WHERE id = $1', [id]);
    }

    async findByParentId(parentId: string): Promise<Topic[]> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; parentTopicId: string; createdAt: Date; version: number }>(
            'SELECT id, name, content, parentTopicId, createdAt, version FROM topics WHERE parentTopicId = $1',
            [parentId]
        );
        return result.rows.map(row => this.mapToTopic(row));
    }

    async findByVersion(id: string, version: number): Promise<Topic | null> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; version: number; createdAt: Date }>(
            'SELECT * FROM topics WHERE id = $1 AND version = $2',
            [id, version]
        );
        return result.rows.length ? this.mapToTopic(result.rows[0]) : null;
    }

    async getPaginatedTopics(limit: number, offset: number, orderBy: string, orderDirection: string): Promise<Topic[]> {
        const result = await this.dbConnection.query<{ id: string; name: string; content: string; createdAt: Date; updatedAt: Date; version: number; parentTopicId?: string }>(
            `SELECT id, name, content, createdAt, updatedAt, version, parentTopicId 
             FROM topics 
             ORDER BY ${orderBy} ${orderDirection} 
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows.map(row => this.mapToTopic(row));
    }

    async getTotalTopicsCount(): Promise<number> {
        const result = await this.dbConnection.query<{ count: string }>(
            'SELECT COUNT(*) AS count FROM topics',
            []
        );
        
        if (!result || !result.rows || !result.rows[0]) {
            return 0;
        }
        
        return parseInt(result.rows[0].count, 10);
    }

    async createTopicHistory(topicHistory: TopicHistory): Promise<TopicHistory> {
        const result = await this.dbConnection.query<{ 
            id: string; 
            topicId: string;
            name: string; 
            content: string; 
            version: number;
            createdAt: Date;
            parentTopicId?: string
        }>(
            `INSERT INTO topic_history 
            (id, topicId, name, content, version, createdAt, parentTopicId) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id, topicId, name, content, version, createdAt, parentTopicId`,
            [
                topicHistory.id, 
                topicHistory.topicId, 
                topicHistory.name, 
                topicHistory.content, 
                topicHistory.version, 
                topicHistory.createdAt, 
                topicHistory.parentTopicId
            ]
        );
        return this.mapToTopicHistory(result.rows[0]);
    }
    
    async getTopicHistory(topicId: string): Promise<TopicHistory[]> {
        const result = await this.dbConnection.query<{
            id: string;
            topicId: string;
            name: string;
            content: string;
            version: number;
            createdAt: Date;
            parentTopicId?: string
        }>(
            `SELECT id, topicId, name, content, version, createdAt, parentTopicId 
             FROM topic_history 
             WHERE topicId = $1 
             ORDER BY version DESC`,
            [topicId]
        );
        
        if (!result || !result.rows) {
            return [];
        }
        
        return result.rows.map(row => this.mapToTopicHistory(row));
    }
    
    async getTopicVersion(topicId: string, version: number): Promise<TopicHistory | null> {
        const result = await this.dbConnection.query<{
            id: string;
            topicId: string;
            name: string;
            content: string;
            version: number;
            createdAt: Date;
            parentTopicId?: string
        }>(
            `SELECT id, topicId, name, content, version, createdAt, parentTopicId 
             FROM topic_history 
             WHERE topicId = $1 AND version = $2`,
            [topicId, version]
        );
        
        return result.rows.length ? this.mapToTopicHistory(result.rows[0]) : null;
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

    private mapToTopicHistory(row: {
        id: string;
        topicId: string;
        name: string;
        content: string;
        version: number;
        createdAt: Date;
        parentTopicId?: string
    }): TopicHistory {
        return new TopicHistory({
            id: row.id,
            topicId: row.topicId,
            name: row.name,
            content: row.content,
            version: row.version,
            createdAt: row.createdAt,
            parentTopicId: row.parentTopicId
        });
    }
}