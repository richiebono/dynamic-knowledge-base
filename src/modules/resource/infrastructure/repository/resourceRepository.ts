import { injectable, inject } from 'inversify';
import { IResourceRepository } from '../../domain/interfaces/resourceRepository';
import { Resource } from '../../domain/entities/resource';
import { ResourceDbConnection } from '../database/resourceDbConnection';

@injectable()
export class ResourceRepository implements IResourceRepository {
    constructor(@inject(ResourceDbConnection) private dbConnection: ResourceDbConnection) {}

    async create(resource: Resource): Promise<Resource> {
        const result = await this.dbConnection.query<{ id: string; topicId: string; url: string; description: string; type: string; createdAt: Date }>(
            'INSERT INTO resources (topicId, url, description, type, createdAt) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [resource.topicId, resource.url, resource.description, resource.type, resource.createdAt]
        );
        return this.mapToResource(result.rows[0]);
    }

    async update(resource: Resource): Promise<Resource> {
        const result = await this.dbConnection.query<{ id: string; topicId: string; url: string; description: string; type: string; updatedAt: Date }>(
            'UPDATE resources SET topicId = $1, url = $2, description = $3, type = $4, updatedAt = $5 WHERE id = $6 RETURNING *',
            [resource.topicId, resource.url, resource.description, resource.type, resource.updatedAt, resource.id]
        );
        return this.mapToResource(result.rows[0]);
    }

    async delete(id: string): Promise<void> {
        await this.dbConnection.query('DELETE FROM resources WHERE id = $1', [id]);
    }

    async findById(id: string): Promise<Resource | null> {
        const result = await this.dbConnection.query<{ id: string; topicId: string; url: string; description: string; type: string; createdAt: Date }>(
            'SELECT * FROM resources WHERE id = $1',
            [id]
        );
        return result.rows.length ? this.mapToResource(result.rows[0]) : null;
    }

    async findAll(): Promise<Resource[]> {
        const result = await this.dbConnection.query<{ id: string; topicId: string; url: string; description: string; type: string; createdAt: Date }>(
            'SELECT * FROM resources'
        );
        return result.rows.map(this.mapToResource);
    }

    async findByTopicId(topicId: string): Promise<Resource[]> {
        const result = await this.dbConnection.query<{ id: string; topicId: string; url: string; description: string; type: string; createdAt: Date }>(
            'SELECT * FROM resources WHERE topicId = $1',
            [topicId]
        );
        return result.rows.map(this.mapToResource);
    }

    async findAllPaginated(limit: number, offset: number, orderBy: string, orderDirection: string): Promise<Resource[]> {
        const query = `
            SELECT * FROM resources
            ORDER BY ${orderBy} ${orderDirection}
            LIMIT $1 OFFSET $2
        `;
        const result = await this.dbConnection.query<{ id: string; topicId: string; url: string; description: string; type: string; createdAt: Date }>(
            query,
            [limit, offset]
        );
        return result.rows.map(this.mapToResource);
    }

    async getTotalResourceCount(): Promise<number> {
        const countQuery = 'SELECT COUNT(*) FROM resources';
        const countResult = await this.dbConnection.query<{ count: string }>(countQuery);
        return parseInt(countResult.rows[0].count, 10);
    }

    private mapToResource(row: { id: string; topicId: string; url: string; description: string; type: string; createdAt?: Date; updatedAt?: Date }): Resource {
        return new Resource({
            id: row.id,
            topicId: row.topicId,
            url: row.url,
            description: row.description,
            type: row.type,
            createdAt: row.createdAt ?? new Date(), 
            updatedAt: row.updatedAt ?? new Date(),
        });
    }
}
