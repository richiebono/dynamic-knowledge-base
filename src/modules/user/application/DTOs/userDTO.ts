import { UserRoleEnum } from '@shared/domain/enum/userRole';

export interface UserDTO {
    id: string;
    name: string;
    email: string;
    role: UserRoleEnum | string;
    createdAt: Date;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role: UserRoleEnum | string;
}

export interface UpdateUserDTO {
    id: string;
    name?: string;
    email?: string;
    password?: string;
    role?: UserRoleEnum | string;
}

export interface LoginDTO {
    email: string;
    password: string;
}