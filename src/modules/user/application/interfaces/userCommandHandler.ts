import { CreateUserDTO, UpdateUserDTO } from '../DTOs/userDTO';

export interface IUserCommandHandler {
    createUser(createUserDTO: CreateUserDTO): Promise<void>;
    updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<void>;
    deleteUser(id: string): Promise<void>;
}
