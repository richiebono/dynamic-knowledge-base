import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../domain/interfaces/userRepository';
import { UserDTO } from '../DTOs/userDTO';
import { User } from '../../domain/entities/user';

@injectable()
export class GetAllUsers {
    constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

    public async execute(): Promise<UserDTO[]> {
        const users: User[] = await this.userRepository.findAll();

        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.toString(),
            createdAt: user.createdAt,
        }));
    }
}
