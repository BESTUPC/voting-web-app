import { ObjectId } from 'mongodb';

import { isIMembership, IMembership } from './IUser';

/**
 * Interface for the poll saved in the database.
 */
export interface IPoll {
    _id?: ObjectId;
    description: string;
    isPriority: boolean;
    isPrivate: boolean;
    pollDeadline: number;
    state: IPollState;
    targetGroup: IMembership;
    pollOptions: Array<string>;
    pollName: string;
}

/**
 * Typeguard for [[IPoll]].
 * @param x object to be checked.
 */
export function isIPoll(x: unknown): x is IPoll {
    const y: IPoll = x as IPoll;
    if (
        y.description !== undefined &&
        y.isPriority !== undefined &&
        y.isPrivate !== undefined &&
        y.pollDeadline !== undefined &&
        y.pollName !== undefined &&
        y.pollOptions !== undefined &&
        y.state !== undefined &&
        y.targetGroup !== undefined
    ) {
        return isIPollState(y.state) && isIMembership(y.targetGroup);
    } else return false;
}

/**
 * Custom type for the different states the poll can have.
 */
export type IPollState = 'open' | 'closed' | 'closed_hidden';

/**
 * Typeguard for [[IPollState]].
 * @param x object to be checked.
 */
export function isIPollState(x: unknown): x is IPollState {
    if (typeof x === 'string') {
        return ['open', 'closed', 'closed_hidden'].includes(x);
    } else return false;
}
