import { UserDTO } from '@user/application/DTOs/userDTO';

export interface IUserQueryHandler {
    getUserById(userId: string): Promise<UserDTO | null>;
    getAllUsers(limit: number, offset: number, orderBy: string, orderDirection: 'ASC' | 'DESC'): Promise<{ users: UserDTO[]; total: number; limit: number; offset: number }>;
}
