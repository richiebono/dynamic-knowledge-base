import { User } from '@user/domain/entities/user';

export interface IUserRepository {
    getTotalUsersCount(): Promise<number>;
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(userId: string): Promise<void>;
    findById(userId: string): Promise<User | null>;
    findAll(limit: number, offset: number, orderBy: string, orderDirection: 'ASC' | 'DESC'): Promise<User[]>;
}