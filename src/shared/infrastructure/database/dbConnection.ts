import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { ENV } from '@shared/infrastructure/config/env';

export abstract class DbConnection {
    private static instance: DbConnection;
    public pool: Pool;

    public constructor() {
        this.pool = new Pool({
            user: ENV.POSTGRES.USER,
            host: ENV.POSTGRES.HOST,
            database: ENV.POSTGRES.DATABASE,
            password: ENV.POSTGRES.PASSWORD,
            port: ENV.POSTGRES.PORT,
        });
    }

    public static getInstance(): DbConnection {
        if (!this.instance) {
            throw new Error('DbConnection instance is not initialized. Use a subclass to initialize it.');
        }
        return this.instance;
    }

    public static initialize(instance: DbConnection): void {
        if (!this.instance) {
            this.instance = instance;
        } else {
            throw new Error('DbConnection instance is already initialized.');
        }
    }

    public static isInitialized(): boolean {
        return !!this.instance;
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