"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicRepositoryImpl = void 0;
const topic_1 = require("../../domain/entities/topic");
class TopicRepositoryImpl {
    constructor(pool) {
        this.pool = pool;
    }
    async create(topic) {
        const result = await this.pool.query('INSERT INTO topics (name, content, createdAt, updatedAt, version, parentTopicId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [topic.name, topic.content, topic.createdAt, topic.updatedAt, topic.version, topic.parentTopicId]);
        return new topic_1.Topic(result.rows[0]);
    }
    async update(topic) {
        const result = await this.pool.query('UPDATE topics SET name = $1, content = $2, updatedAt = $3, version = $4, parentTopicId = $5 WHERE id = $6 RETURNING *', [topic.name, topic.content, topic.updatedAt, topic.version, topic.parentTopicId, topic.id]);
        return new topic_1.Topic(result.rows[0]);
    }
    async findById(id) {
        const result = await this.pool.query('SELECT * FROM topics WHERE id = $1', [id]);
        return result.rows.length ? new topic_1.Topic(result.rows[0]) : null;
    }
    async findAll() {
        const result = await this.pool.query('SELECT * FROM topics');
        return result.rows.map(row => new topic_1.Topic(row));
    }
    async delete(id) {
        await this.pool.query('DELETE FROM topics WHERE id = $1', [id]);
    }
    async findByParentId(parentId) {
        const result = await this.pool.query('SELECT * FROM topics WHERE parentTopicId = $1', [parentId]);
        return result.rows.map(row => new topic_1.Topic(row));
    }
    async findByVersion(id, version) {
        const result = await this.pool.query('SELECT * FROM topics WHERE id = $1 AND version = $2', [id, version]);
        return result.rows.length ? new topic_1.Topic(result.rows[0]) : null;
    }
}
exports.TopicRepositoryImpl = TopicRepositoryImpl;
