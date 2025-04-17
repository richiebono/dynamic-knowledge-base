import { inject, injectable } from 'inversify';
import { IUserQueryHandler } from '../interfaces/userQueryHandler';
import { UserDTO } from '../DTOs/userDTO';
import { GetUserById } from '../useCases/getUserById';
import { GetAllUsers } from '../useCases/getAllUsers';

@injectable()
export class UserQueryHandler implements IUserQueryHandler {
    constructor(
        @inject(GetUserById) private getUserByIdUseCase: GetUserById,
        @inject(GetAllUsers) private getAllUsersUseCase: GetAllUsers
    ) {}
    public async getUserById(userId: string): Promise<UserDTO | null> {
        return await this.getUserByIdUseCase.execute(userId);
    }

    public async getAllUsers(): Promise<UserDTO[]> {
        return await this.getAllUsersUseCase.execute();
    }
}
