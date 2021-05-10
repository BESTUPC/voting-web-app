import { ObjectId } from 'mongodb';

import { EMembership } from './IUser';

/**
 * Interface for the poll saved in the database.
 */
export interface IPoll {
    _id?: ObjectId;
    description: string;
    isPriority: boolean;
    isPrivate: boolean;
    pollDeadline: number;
    state: EPollState;
    targetGroup: EMembership;
    pollOptions: Array<IPollOption>;
    pollName: string;
    approvalRatio: EPollApprovalRatio;
    abstentionIsValid: boolean;
}

export interface IPollOption {
    name: string;
    isAbstention: boolean;
    isAgainst: boolean;
}

/**
 * Enum for the different poll approval ratios
 *
 */
export enum EPollApprovalRatio {
    SIMPLE = 'SIMPLE',
    ABSOLUTE = 'ABSOLUTE',
    TWO_THIRDS = 'TWO_THIRDS',
}

/**
 * Custom enum for the different states the poll can have.
 */
export enum EPollState {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    CLOSED_HIDDEN = 'CLOSED_HIDDEN',
}
