import { injectable, inject } from 'inversify';
import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/interfaces/userRepository';
import { UserRoleEnum } from '../../domain/enum/userRole';
import { UserDbConnection } from '../database/userDbConnection';

@injectable()
export class UserRepository implements IUserRepository {
    constructor(@inject(UserDbConnection) private dbConnection: UserDbConnection) {}

    async create(user: User): Promise<User> {
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; createdAt: Date }>(
            'INSERT INTO users (name, email, role, createdAt) VALUES ($1, $2, $3, $4) RETURNING *',
            [user.name, user.email, user.role, user.createdAt]
        );
        return this.mapToUser(result.rows[0]);
    }

    async update(user: User): Promise<User> {
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; updatedAt: Date }>(
            'UPDATE users SET name = $1, email = $2, role = $3, updatedAt = $4 WHERE id = $5 RETURNING *',
            [user.name, user.email, user.role, user.updatedAt, user.id]
        );
        return this.mapToUser(result.rows[0]);
    }

    async findById(id: string): Promise<User | null> {
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; createdAt: Date }>(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return result.rows.length ? this.mapToUser(result.rows[0]) : null;
    }

    async findAll(): Promise<User[]> {
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; createdAt: Date }>(
            'SELECT * FROM users'
        );
        return result.rows.map(this.mapToUser);
    }

    async delete(id: string): Promise<void> {
        await this.dbConnection.query('DELETE FROM users WHERE id = $1', [id]);
    }

    private mapToUser(row: { id: string; name: string; email: string; role: string; createdAt?: Date; updatedAt?: Date }): User {
        return new User({
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role as UserRoleEnum,
            createdAt: row.createdAt || new Date(), 
            updatedAt: row.updatedAt,
        });
    }
}