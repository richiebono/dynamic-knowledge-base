import { CreateUserDTO, LoginDTO, UpdateUserDTO } from '@user/application/DTOs/userDTO';

export interface IUserCommandHandler {
    createUser(createUserDTO: CreateUserDTO): Promise<void>;
    updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<void>;
    deleteUser(id: string): Promise<void>;
    loginUser(login: LoginDTO): Promise<string>;
}
