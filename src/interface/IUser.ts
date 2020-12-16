import { ObjectId } from 'mongodb';
export interface IUser {
    _id?: ObjectId;
    userId: string;
    membership: Array<IMembership>;
    name: string;
    email: string;
}

export type IMembership = 'all' | 'member' | 'full' | 'admin';
