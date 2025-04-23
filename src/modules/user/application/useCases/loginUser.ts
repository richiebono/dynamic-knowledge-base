import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV } from '@shared/infrastructure/config/env';
import { IUserRepository } from '@user/domain/interfaces/userRepository';
import { LoginDTO } from '@user/application/DTOs/userDTO';


@injectable()
export class LoginUser {
    constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

    async execute(login: LoginDTO): Promise<{ token: string, userId: string }> {
        const user = await this.userRepository.findByEmail(login.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(login.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, ENV.JWT.SECRET as string, { expiresIn: ENV.JWT.EXPIRES_IN });
        return { token, userId: user.id };
    }
}
