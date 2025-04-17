"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationRunner = void 0;
const pg_1 = require("pg");
const inversify_1 = require("inversify");
let MigrationRunner = class MigrationRunner {
    constructor(pool) {
        this.pool = pool;
    }
    async up() {
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
        }
        catch (err) {
            console.error('Error applying migration:', err);
            throw err;
        }
        finally {
            client.release();
        }
    }
    async down() {
        const client = await this.pool.connect();
        try {
            await client.query(`
                DROP TABLE IF EXISTS users;
            `);
            console.log('Migration reverted: Table "users" dropped.');
        }
        catch (err) {
            console.error('Error reverting migration:', err);
            throw err;
        }
        finally {
            client.release();
        }
    }
    async close() {
        await this.pool.end();
    }
};
MigrationRunner = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [pg_1.Pool])
], MigrationRunner);
exports.MigrationRunner = MigrationRunner;
