import { inject, injectable } from 'inversify';
import { IUserRepository } from '@user/domain/interfaces/userRepository';

@injectable()
export class GetTotalUsersCount {
    constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

    public async execute(): Promise<number> {
        return await this.userRepository.getTotalUsersCount();
    }
}
