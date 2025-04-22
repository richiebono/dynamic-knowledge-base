import { Pool } from 'pg';

export class MigrationRunner {
    constructor(private pool: Pool) {}

    public async up(): Promise<void> {
        const client = await this.pool.connect();
        try {
            // Create users table
            await client.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'USER', 'MODERATOR')),
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // Create topics table
            await client.query(`
                CREATE TABLE IF NOT EXISTS topics (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    name VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    parentTopicId UUID REFERENCES topics(id) ON DELETE SET NULL,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    version INT DEFAULT 1 NOT NULL
                );
            `);

            // Create resources table
            await client.query(`
                CREATE TABLE IF NOT EXISTS resources (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    topicId UUID REFERENCES topics(id) ON DELETE CASCADE,
                    url TEXT NOT NULL,
                    description TEXT,
                    type VARCHAR(50) NOT NULL,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            console.log('Migration applied: Tables "users", "topics", and "resources" created (if not exists).');
        } catch (err) {
            console.error('Error applying migration:', err);
            throw err;
        } finally {
            client.release();
        }
    }

    public async down(): Promise<void> {
        const client = await this.pool.connect();
        try {
            // Drop resources table
            await client.query(`
                DROP TABLE IF EXISTS resources;
            `);

            // Drop topics table
            await client.query(`
                DROP TABLE IF EXISTS topics;
            `);

            // Drop users table
            await client.query(`
                DROP TABLE IF EXISTS users;
            `);

            console.log('Migration reverted: Tables "users", "topics", and "resources" dropped.');
        } catch (err) {
            console.error('Error reverting migration:', err);
            throw err;
        } finally {
            client.release();
        }
    }

    public async close(): Promise<void> {
        await this.pool.end();
    }
}
