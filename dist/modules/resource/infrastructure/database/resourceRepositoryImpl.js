"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceRepositoryImpl = void 0;
const dbConnection_1 = require("../../../../shared/infrastructure/database/dbConnection");
class ResourceRepositoryImpl {
    async create(resource) {
        const result = await dbConnection_1.dbConnection.query('INSERT INTO resources (topicId, url, description, type, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [resource.topicId, resource.url, resource.description, resource.type, resource.createdAt, resource.updatedAt]);
        return result.rows[0];
    }
    async update(resource) {
        const result = await dbConnection_1.dbConnection.query('UPDATE resources SET url = $1, description = $2, type = $3, updatedAt = $4 WHERE id = $5 RETURNING *', [resource.url, resource.description, resource.type, resource.updatedAt, resource.id]);
        return result.rows[0];
    }
    async findById(id) {
        const result = await dbConnection_1.dbConnection.query('SELECT * FROM resources WHERE id = $1', [id]);
        return result.rows.length ? result.rows[0] : null;
    }
    async delete(id) {
        await dbConnection_1.dbConnection.query('DELETE FROM resources WHERE id = $1', [id]);
    }
    async findByTopicId(topicId) {
        const result = await dbConnection_1.dbConnection.query('SELECT * FROM resources WHERE topicId = $1', [topicId]);
        return result.rows;
    }
}
exports.ResourceRepositoryImpl = ResourceRepositoryImpl;
