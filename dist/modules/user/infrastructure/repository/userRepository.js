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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const user_1 = require("../../domain/entities/user");
const dbConnection_1 = require("../../../../shared/infrastructure/database/dbConnection");
let UserRepository = class UserRepository {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }
    async create(user) {
        const result = await this.dbConnection.query('INSERT INTO users (name, email, role, createdAt) VALUES ($1, $2, $3, $4) RETURNING *', [user.name, user.email, user.role, user.createdAt]);
        return this.mapToUser(result.rows[0]);
    }
    async update(user) {
        const result = await this.dbConnection.query('UPDATE users SET name = $1, email = $2, role = $3, updatedAt = $4 WHERE id = $5 RETURNING *', [user.name, user.email, user.role, user.updatedAt, user.id]);
        return this.mapToUser(result.rows[0]);
    }
    async findById(id) {
        const result = await this.dbConnection.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows.length ? this.mapToUser(result.rows[0]) : null;
    }
    async findAll() {
        const result = await this.dbConnection.query('SELECT * FROM users');
        return result.rows.map(this.mapToUser);
    }
    async delete(id) {
        await this.dbConnection.query('DELETE FROM users WHERE id = $1', [id]);
    }
    mapToUser(row) {
        return new user_1.User({
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role,
            createdAt: row.createdAt || new Date(),
            updatedAt: row.updatedAt,
        });
    }
};
UserRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(dbConnection_1.DbConnection)),
    __metadata("design:paramtypes", [dbConnection_1.DbConnection])
], UserRepository);
exports.UserRepository = UserRepository;
