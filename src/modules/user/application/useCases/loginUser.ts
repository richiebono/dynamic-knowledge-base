import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../domain/interfaces/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@injectable()
export class LoginUser {
    constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

    async execute(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        return token;
    }
}
