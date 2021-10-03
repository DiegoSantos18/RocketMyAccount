export interface User{
    id: number;
    name: string;
    lastName: string;
    role: Role;
    email: string;
    password: string;
    token: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface AuthorizationUser {
    id: number;
    name: string;
    lastName: string;
    role: Role;
    token: string;
}

export enum Role{
    ADMIN = 0,
    USER = 1
}