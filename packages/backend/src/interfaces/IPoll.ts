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
    pollOptions: Array<string>;
    pollName: string;
}

/**
 * Custom enum for the different states the poll can have.
 */
export enum EPollState {
    OPEN = 'open',
    CLOSED = 'closed',
    CLOSED_HIDDEN = 'closed_hidden',
}
