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
        
        // Create a new user with the exact values expected by the test
        const user = new User({
            id: uuidv4(),
            name: createUserDTO.name,
            email: createUserDTO.email,
            role: UserRoleEnum[createUserDTO.role as keyof typeof UserRoleEnum],  // Directly use the enum
            password: hashedPassword,
            createdAt: new Date(),
        });
        
        // Execute repository create with the properly constructed user object
        await this.userRepository.create(user);
    }
}