import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { ENV } from '../config/env';

export abstract class DbConnection {
    private static instance: DbConnection;
    protected pool: Pool;

    protected constructor() {
        this.pool = new Pool({
            user: ENV.DATABASE_URL.split(':')[1]?.replace('//', '') || '',
            host: ENV.DATABASE_URL.split('@')[1]?.split(':')[0] || '',
            database: ENV.DATABASE_URL.split('/').pop() || '',
            password: ENV.DATABASE_URL.split(':')[2]?.split('@')[0] || '',
            port: parseInt(ENV.DATABASE_URL.split(':')[3]?.split('/')[0] || '5432', 10),
        });
    }

    public static getInstance(): DbConnection {
        if (!this.instance) {
            throw new Error('DbConnection instance is not initialized. Use a subclass to initialize it.');
        }
        return this.instance;
    }

    protected static initialize(instance: DbConnection): void {
        if (!this.instance) {
            this.instance = instance;
        } else {
            throw new Error('DbConnection instance is already initialized.');
        }
    }

    public async query<T extends QueryResultRow>(text: string, params?: any[]): Promise<QueryResult<T>> {
        return this.pool.query<T>(text, params);
    }

    public async getClient(): Promise<PoolClient> {
        return this.pool.connect();
    }

    public async close(): Promise<void> {
        await this.pool.end();
    }
}