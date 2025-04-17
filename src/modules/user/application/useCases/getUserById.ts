import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../domain/interfaces/userRepository';
import { UserDTO } from '../DTOs/userDTO';
import { User } from '../../domain/entities/user';

@injectable()
export class GetUserById {
    constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

    public async execute(userId: string): Promise<UserDTO | null> {
        const user: User | null = await this.userRepository.findById(userId);
        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.toString(),
            createdAt: user.createdAt,
        };
    }
}
