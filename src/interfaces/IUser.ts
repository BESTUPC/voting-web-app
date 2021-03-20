import { ObjectId } from 'mongodb';

/**
 * Interface for the user saved in the database.
 */
export interface IUser {
    _id?: ObjectId;
    userId: string;
    membership: Array<EMembership>;
    name: string;
    email: string;
}

/**
 * Interface for the user we get through the authentication middleware.
 */
export interface IGoogleUser {
    id: string;
    displayName: string;
    emails?: Array<{ value: string; type?: string }>;
}

/**
 * Typeguard for [[IGoogleUser]].
 * @param x object to check.
 */
export function isIGoogleUser(x: unknown): x is IGoogleUser {
    const y: IGoogleUser = x as IGoogleUser;
    return y.id !== undefined && y.displayName !== undefined;
}

/**
 * Custom enum for the different memberships a user can have.
 */
export enum EMembership {
    ALL = 'all',
    MEMBER = 'member',
    FULL = 'full',
    ADMIN = 'admin',
}
