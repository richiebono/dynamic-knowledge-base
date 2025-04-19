import { injectable, inject } from 'inversify';
import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/interfaces/userRepository';
import { UserDbConnection } from '../database/userDbConnection';
import { UserRoleEnum } from '../../../../shared/domain/enum/userRole';

@injectable()
export class UserRepository implements IUserRepository {
    constructor(@inject(UserDbConnection) private dbConnection: UserDbConnection) {}
     
    async create(user: User): Promise<User> {
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; password: string; createdAt: Date }>(
            'INSERT INTO users (name, email, role, password, createdAt) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, password, createdAt',
            [user.name, user.email, user.role, user.password, user.createdAt]
        );
        return this.mapToUser(result.rows[0]);
    }

    async update(user: User): Promise<User> {
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; password: string; updatedAt: Date }>(
            'UPDATE users SET name = $1, email = $2, role = $3, password = COALESCE($4, password), updatedAt = $5 WHERE id = $6 RETURNING id, name, email, role, password, updatedAt',
            [user.name, user.email, user.role, user.password, user.updatedAt, user.id]
        );
        return this.mapToUser(result.rows[0]);
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; password: string }>(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows.length ? this.mapToUser(result.rows[0]) : null;
    }
    
    async findById(id: string): Promise<User | null> {
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; password: string; createdAt: Date; updatedAt?: Date }>(
            'SELECT id, name, email, role, password, createdAt, updatedAt FROM users WHERE id = $1',
            [id]
        );
        return result.rows.length ? this.mapToUser(result.rows[0]) : null;
    }

    async findAll(): Promise<User[]> {
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; password: string; createdAt: Date; updatedAt?: Date }>(
            'SELECT id, name, email, role, password, createdAt, updatedAt FROM users'
        );
        return result.rows.map(this.mapToUser);
    }

    async delete(id: string): Promise<void> {
        await this.dbConnection.query('DELETE FROM users WHERE id = $1', [id]);
    }

    private mapToUser(row: { id: string; name: string; email: string; role: string; password: string; createdAt?: Date; updatedAt?: Date }): User {
        return new User({
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role as UserRoleEnum,
            password: row.password,
            createdAt: row.createdAt || new Date(),
            updatedAt: row.updatedAt,
        });
    }
}