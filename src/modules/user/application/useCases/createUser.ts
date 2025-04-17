import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../../domain/interfaces/userRepository';
import { CreateUserDTO } from '../DTOs/userDTO';
import { User } from '../../domain/entities/user';
import { UserRoleEnum } from '../../domain/enum/userRole';

@injectable()
export class CreateUser {
    private userRepository: IUserRepository;

    constructor(@inject('IUserRepository') userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(userData: CreateUserDTO): Promise<User> {
        const user = new User({
            id: uuidv4(),
            name: userData.name,
            email: userData.email,
            role: userData.role as UserRoleEnum,
            createdAt: new Date(),
        });

        return await this.userRepository.create(user);
    }
}