import { inject, injectable } from 'inversify';
import { IUserRepository } from '@user/domain/interfaces/userRepository';
import { UserDTO } from '@user/application/DTOs/userDTO';
import { User } from '@user/domain/entities/user';

@injectable()
export class GetAllUsers {
    constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

    public async execute(limit: number, offset: number, orderBy: string, orderDirection: 'ASC' | 'DESC'): Promise<UserDTO[]> {
        const users: User[] = await this.userRepository.findAll(limit, offset, orderBy, orderDirection);

        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.toString(),
            createdAt: user.createdAt,
        }));
    }
}
