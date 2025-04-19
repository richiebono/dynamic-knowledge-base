import { UserRoleEnum } from '../enum/userRole';

export class User {
    id: string;
    name: string;
    email: string;
    role: UserRoleEnum;
    password: string;
    createdAt: Date;
    updatedAt?: Date;

    constructor({ id, name, email, role, password, createdAt, updatedAt }: User) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}