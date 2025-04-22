import { inject, injectable } from 'inversify';
import { IUserRepository } from '@user/domain/interfaces/userRepository';

@injectable()
export class DeleteUser {
    private userRepository: IUserRepository;

    constructor(@inject('IUserRepository') userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await this.userRepository.delete(userId);
    }
}
