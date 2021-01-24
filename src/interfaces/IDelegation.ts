import { ObjectId } from 'mongodb';

/**
 * Interface for the delegations in the database.
 */
export interface IDelegation {
    _id?: ObjectId;
    userIdDelegator: string;
    userIdReceiver: string;
}

/**
 * Typeguard for [[IDelegation]].
 * @param x object to check.
 */
export function isIDelegation(x: unknown): x is IDelegation {
    const y: IDelegation = x as IDelegation;
    return y.userIdDelegator !== undefined && y.userIdReceiver !== undefined;
}
