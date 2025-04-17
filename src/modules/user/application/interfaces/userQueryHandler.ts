import { UserDTO } from '../DTOs/userDTO';

export interface IUserQueryHandler {
    getUserById(userId: string): Promise<UserDTO | null>;
    getAllUsers(): Promise<UserDTO[]>;
}
