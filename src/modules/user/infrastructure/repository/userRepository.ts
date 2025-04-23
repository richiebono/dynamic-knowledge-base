import { injectable, inject } from 'inversify';
import { UserRoleEnum } from '@shared/domain/enum/userRole';
import { User } from '@user/domain/entities/user';
import { IUserRepository } from '@user/domain/interfaces/userRepository';
import { UserDbConnection } from '@user/infrastructure/database/userDbConnection';


@injectable()
export class UserRepository implements IUserRepository {
    constructor(@inject(UserDbConnection) private dbConnection: UserDbConnection) {}
     
    async create(user: User): Promise<User> {
        const roleValue = user.role.toUpperCase();
        
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; password: string; createdAt: Date }>(
            'INSERT INTO users (name, email, role, password, createdAt) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, password, createdAt',
            [user.name, user.email, roleValue, user.password, user.createdAt]
        );
        return this.mapToUser(result.rows[0]);
    }

    async update(user: User): Promise<User> {
        // Convert the role to lowercase to match database constraints
        const roleValue = user.role.toLowerCase();
        
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; password: string; updatedAt: Date }>(
            'UPDATE users SET name = $1, email = $2, role = $3, password = COALESCE($4, password), updatedAt = $5 WHERE id = $6 RETURNING id, name, email, role, password, updatedAt',
            [user.name, user.email, roleValue, user.password, user.updatedAt, user.id]
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

    async findAll(limit: number, offset: number, orderBy: string, orderDirection: 'ASC' | 'DESC'): Promise<User[]> {
        const result = await this.dbConnection.query<{ id: string; name: string; email: string; role: string; password: string; createdAt: Date; updatedAt?: Date }>(
            `SELECT id, name, email, role, password, createdAt, updatedAt 
             FROM users 
             ORDER BY ${orderBy} ${orderDirection} 
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows.map(this.mapToUser);
    }

    async getTotalUsersCount(): Promise<number> {
        const result = await this.dbConnection.query<{ count: string }>('SELECT COUNT(*) as count FROM users');
        return parseInt(result.rows[0].count, 10);
    }

    async delete(id: string): Promise<void> {
        await this.dbConnection.query('DELETE FROM users WHERE id = $1', [id]);
    }

    private mapToUser(row: { id: string; name: string; email: string; role: string; password: string; createdAt?: Date; updatedAt?: Date }): User {
        return new User({
            id: row.id,
            name: row.name,
            email: row.email,
            // Convert database role (likely lowercase) to match our enum case
            role: row.role.charAt(0).toUpperCase() + row.role.slice(1) as UserRoleEnum,
            password: row.password,
            createdAt: row.createdAt || new Date(),
            updatedAt: row.updatedAt,
        });
    }
}