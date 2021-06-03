import { EMembership, IUser } from '../domain';

export interface LoginBody {
    token: string;
}

export interface UpdateMembershipBody {
    membership: EMembership[];
}

export type GetCurrentUserResponse = IUser;
export type GetUsersResponse = IUser[];
