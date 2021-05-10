import { IUser } from '../domain';

export interface LoginBody {
    token: string;
}

export type GetCurrentUserResponse = IUser;
