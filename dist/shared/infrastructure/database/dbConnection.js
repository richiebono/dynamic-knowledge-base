"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbConnection = void 0;
const pg_1 = require("pg");
const env_1 = require("../config/env");
class DbConnection {
    constructor() {
        this.pool = new pg_1.Pool({
            user: env_1.ENV.DATABASE_URL.split(':')[1]?.replace('//', '') || '',
            host: env_1.ENV.DATABASE_URL.split('@')[1]?.split(':')[0] || '',
            database: env_1.ENV.DATABASE_URL.split('/').pop() || '',
            password: env_1.ENV.DATABASE_URL.split(':')[2]?.split('@')[0] || '',
            port: parseInt(env_1.ENV.DATABASE_URL.split(':')[3]?.split('/')[0] || '5432', 10),
        });
    }
    static getInstance() {
        if (!this.instance) {
            throw new Error('DbConnection instance is not initialized. Use a subclass to initialize it.');
        }
        return this.instance;
    }
    static initialize(instance) {
        if (!this.instance) {
            this.instance = instance;
        }
        else {
            throw new Error('DbConnection instance is already initialized.');
        }
    }
    async query(text, params) {
        return this.pool.query(text, params);
    }
    async getClient() {
        return this.pool.connect();
    }
    async close() {
        await this.pool.end();
    }
}
exports.DbConnection = DbConnection;
