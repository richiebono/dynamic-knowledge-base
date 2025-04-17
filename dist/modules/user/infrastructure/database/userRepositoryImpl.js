"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
const user_1 = require("../../domain/entities/user");
const dbConnection_1 = require("../../../../shared/infrastructure/database/dbConnection");
class UserRepositoryImpl {
    async create(user) {
        const result = await dbConnection_1.dbConnection.query('INSERT INTO users (name, email, role, createdAt) VALUES ($1, $2, $3, $4) RETURNING *', [user.name, user.email, user.role, user.createdAt]);
        return new user_1.User(result.rows[0]);
    }
    async update(user) {
        const result = await dbConnection_1.dbConnection.query('UPDATE users SET name = $1, email = $2, role = $3, updatedAt = $4 WHERE id = $5 RETURNING *', [user.name, user.email, user.role, user.updatedAt, user.id]);
        return new user_1.User(result.rows[0]);
    }
    async findById(id) {
        const result = await dbConnection_1.dbConnection.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows.length ? new user_1.User(result.rows[0]) : null;
    }
    async findAll() {
        const result = await dbConnection_1.dbConnection.query('SELECT * FROM users');
        return result.rows.map(row => new user_1.User(row));
    }
    async delete(id) {
        await dbConnection_1.dbConnection.query('DELETE FROM users WHERE id = $1', [id]);
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
