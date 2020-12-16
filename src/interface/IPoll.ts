import { ObjectId } from 'mongodb';

import { IMembership } from './IUser';

export interface IPoll {
    _id?: ObjectId;
    description: string;
    isPriority: boolean;
    isPrivate: boolean;
    pollDeadline: number;
    state: IPollState;
    targetGroup: IMembership;
    pollOptions: Array<string>;
}

export type IPollState = 'open' | 'closed';
