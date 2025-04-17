import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../domain/interfaces/userRepository';
import { UpdateUserDTO } from '../DTOs/userDTO';
import { User } from '../../domain/entities/user';
import { UserRoleEnum } from '../../domain/enum/userRole';

@injectable()
export class UpdateUser {
    private userRepository: IUserRepository;

    constructor(@inject('IUserRepository') userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId: string, userData: UpdateUserDTO): Promise<User> {
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }

        const updatedUser = new User({
            id: existingUser.id,
            name: userData.name || existingUser.name,
            email: userData.email || existingUser.email,
            role: userData.role ? (userData.role as UserRoleEnum) : existingUser.role,
            createdAt: existingUser.createdAt,
            updatedAt: new Date()
        });

        await this.userRepository.update(updatedUser);
        return updatedUser;
    }
}