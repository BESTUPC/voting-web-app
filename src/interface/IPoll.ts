import { ObjectId } from 'mongodb';

import { isIMembership, IMembership } from './IUser';

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

export function isIPoll(x: unknown): x is IPoll {
    const y: IPoll = x as IPoll;
    if (Object.values(y).every((item) => item !== undefined)) {
        return isIPollState(y.state) && isIMembership(y.targetGroup);
    } else return false;
}

export type IPollState = 'open' | 'closed';

export function isIPollState(x: unknown): x is IPollState {
    if (typeof x === 'string') {
        return ['open', 'closed'].includes(x);
    } else return false;
}
