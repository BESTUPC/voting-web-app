import { ObjectId } from 'mongodb';

/**
 * Interface for the delegations in the database.
 */
export interface IDelegation {
    _id?: ObjectId;
    userIdDelegator: string;
    userIdReceiver: string;
}
