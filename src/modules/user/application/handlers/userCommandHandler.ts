import { inject, injectable } from 'inversify';
import { IUserCommandHandler } from '../interfaces/userCommandHandler';
import { CreateUser } from '../useCases/createUser';
import { UpdateUser } from '../useCases/updateUser';
import { CreateUserDTO, UpdateUserDTO } from '../DTOs/userDTO';
import { DeleteUser } from '../useCases/deleteUser';

@injectable()
export class UserCommandHandler implements IUserCommandHandler {
    constructor(
        @inject(CreateUser) private createUserUseCase: CreateUser,
        @inject(UpdateUser) private updateUserUseCase: UpdateUser,
        @inject(DeleteUser) private deleteUserUseCase: DeleteUser
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
}