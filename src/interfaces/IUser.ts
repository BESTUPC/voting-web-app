import { ObjectId } from 'mongodb';

/**
 * Interface for the user saved in the database.
 */
export interface IUser {
    _id?: ObjectId;
    userId: string;
    membership: Array<IMembership>;
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
 * Custom type for the different memberships a user can have.
 */
export type IMembership = 'all' | 'member' | 'full' | 'admin';

/**
 * Typeguard for array of [[IMembership]].
 * @param x object to check.
 */
export function isIMembershipArray(x: unknown): x is Array<IMembership> {
    if (x instanceof Array) {
        return x.every((item) => isIMembership(item));
    } else return false;
}

/**
 * Typeguard for [[IMembership]].
 * @param x object to check.
 */
export function isIMembership(x: unknown): x is IMembership {
    if (typeof x === 'string') {
        return ['all', 'member', 'full', 'admin'].includes(x);
    } else return false;
}
