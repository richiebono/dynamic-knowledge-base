import { inject, injectable } from 'inversify';
import { IUserCommandHandler } from '@user/application/interfaces/userCommandHandler';
import { CreateUser } from '@user/application/useCases/createUser';
import { UpdateUser } from '@user/application/useCases/updateUser';
import { LoginUser } from '@user/application/useCases/loginUser';
import { CreateUserDTO, UpdateUserDTO, LoginDTO } from '@user/application/DTOs/userDTO';
import { DeleteUser } from '@user/application/useCases/deleteUser';

@injectable()
export class UserCommandHandler implements IUserCommandHandler {
    constructor(
        @inject(CreateUser) private createUserUseCase: CreateUser,
        @inject(UpdateUser) private updateUserUseCase: UpdateUser,
        @inject(DeleteUser) private deleteUserUseCase: DeleteUser,
        @inject(LoginUser) private loginUserUseCase: LoginUser,
    ) {}
    
    async createUser(createUserDTO: CreateUserDTO): Promise<void> {
        await this.createUserUseCase.execute(createUserDTO);
    }

    async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<void> {
        await this.updateUserUseCase.execute(id, updateUserDTO);
    }

    async deleteUser(id: string): Promise<void> {
        await this.deleteUserUseCase.execute(id);
    }

    async loginUser(login: LoginDTO): Promise<string> {
        return await this.loginUserUseCase.execute(login);
    }
}