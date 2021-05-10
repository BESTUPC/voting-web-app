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
    picture: string;
}

/**
 * Custom enum for the different memberships a user can have.
 */
export enum EMembership {
    ALL = 'ALL',
    MEMBER = 'MEMBER',
    FULL = 'FULL',
    ADMIN = 'ADMIN',
}
