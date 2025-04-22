import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserRoleEnum } from '@shared/domain/enum/userRole';
import { IUserRepository } from '@user/domain/interfaces/userRepository';
import { CreateUserDTO } from '@user/application/DTOs/userDTO';
import { User } from '@user/domain/entities/user';

@injectable()
export class CreateUser {
    constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

    async execute(createUserDTO: CreateUserDTO): Promise<void> {
        const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);
        const user = new User({
            id: uuidv4(),
            name: createUserDTO.name,
            email: createUserDTO.email,
            role: createUserDTO.role as UserRoleEnum,
            password: hashedPassword,
            createdAt: new Date(),
        });
        await this.userRepository.create(user);
    }
}