import { Pool } from 'pg';

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
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'EDITOR', 'VIEWER')),
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            await client.query(`
                DO $$
                BEGIN
                    -- Verifica se a tabela users existe
                    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
                        -- Remove a constraint existente, se houver
                        IF EXISTS (SELECT FROM pg_constraint WHERE conname = 'users_role_check') THEN
                            ALTER TABLE users DROP CONSTRAINT users_role_check;
                        END IF;
                        
                        -- Adiciona a nova constraint
                        ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('Admin', 'Editor', 'Viewer'));
                    END IF;
                END $$;
            `);

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

            await client.query(`
                CREATE TABLE IF NOT EXISTS topic_history (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    topicId UUID REFERENCES topics(id) ON DELETE CASCADE,
                    name VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    version INT NOT NULL,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    parentTopicId UUID
                );
            `);

            console.log('Migration applied: Tables "users", "topics", "resources", and "topic_history" created (if not exists).');
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
                DROP TABLE IF EXISTS resources;
            `);

            await client.query(`
                DROP TABLE IF EXISTS topic_history;
            `);

            await client.query(`
                DROP TABLE IF EXISTS topics;
            `);

            await client.query(`
                DROP TABLE IF EXISTS users;
            `);

            console.log('Migration reverted: Tables "users", "topics", "resources", and "topic_history" dropped.');
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
