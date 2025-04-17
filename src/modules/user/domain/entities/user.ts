import { UserRoleEnum } from '../enum/userRole';

export class User {
    id: string;
    name: string;
    email: string;
    role: UserRoleEnum;
    createdAt: Date;
    updatedAt?: Date;

    constructor({ id, name, email, role, createdAt, updatedAt }: User) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}