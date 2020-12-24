import { ObjectId } from 'mongodb';
export interface IUser {
    _id?: ObjectId;
    userId: string;
    membership: Array<IMembership>;
    name: string;
    email: string;
}

export function isIUser(x: unknown): x is IUser {
    const y: IUser = x as IUser;
    if (Object.values(y).every((item) => item !== undefined)) {
        return y.membership.every((item) => isIMembership(item));
    } else return false;
}

export type IMembership = 'all' | 'member' | 'full' | 'admin';

export function isIMembershipArray(x: unknown): x is Array<IMembership> {
    if (x instanceof Array) {
        return x.every((item) => isIMembership(item));
    } else return false;
}
export function isIMembership(x: unknown): x is IMembership {
    if (typeof x === 'string') {
        return ['all', 'member', 'full', 'admin'].includes(x);
    } else return false;
}
