import { Pool } from 'pg';
import { injectable } from 'inversify';

@injectable()
export class MigrationRunner {
    constructor(private pool: Pool) {}

    public async up(): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'USER', 'MODERATOR')),
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('Migration applied: Table "users" created (if not exists).');
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
            await client.query(`
                DROP TABLE IF EXISTS users;
            `);
            console.log('Migration reverted: Table "users" dropped.');
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
