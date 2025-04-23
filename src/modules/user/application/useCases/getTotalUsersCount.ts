import { inject, injectable } from 'inversify';
import { IUserRepository } from '@user/domain/interfaces/userRepository';

@injectable()
export class GetTotalUsersCount {
    constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

    public async execute(): Promise<number> {
        return await this.userRepository.getTotalUsersCount();
    }
}
