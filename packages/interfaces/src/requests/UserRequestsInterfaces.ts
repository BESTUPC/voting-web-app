import { IGoogleUser, IUser } from '../domain/IUser';

export type GetCurrentUserResponse = { web: IUser; google: IGoogleUser };

export type LoginBody = { token: string };
