import { inject, injectable } from 'inversify';
import { IUserQueryHandler } from '@user/application/interfaces/userQueryHandler';
import { UserDTO } from '@user/application/DTOs/userDTO';
import { GetUserById } from '@user/application/useCases/getUserById';
import { GetAllUsers } from '@user/application/useCases/getAllUsers';
import { GetTotalUsersCount } from '@user/application/useCases/getTotalUsersCount';

@injectable()
export class UserQueryHandler implements IUserQueryHandler {
    constructor(
        @inject(GetUserById) private getUserByIdUseCase: GetUserById,
        @inject(GetAllUsers) private getAllUsersUseCase: GetAllUsers,
        @inject(GetTotalUsersCount) private getTotalUsersCountUseCase: GetTotalUsersCount
    ) {}
    public async getUserById(userId: string): Promise<UserDTO | null> {
        return await this.getUserByIdUseCase.execute(userId);
    }

    public async getAllUsers(limit: number, offset: number, orderBy: string, orderDirection: 'ASC' | 'DESC'): Promise<{ users: UserDTO[]; total: number; limit: number; offset: number }> {
        const users = await this.getAllUsersUseCase.execute(limit, offset, orderBy, orderDirection);
        const total = await this.getTotalUsersCountUseCase.execute();
        return { users, total, limit, offset };
    }
}
