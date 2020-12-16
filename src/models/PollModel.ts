import { Collection } from 'mongodb';
import { IMembership } from '../interface/IUser';
import { IPoll, IPollState } from '../interface/IPoll';
import Database from '../providers/Database';

export default class PollModel {
    private static getCollection(): Collection {
        return Database.getDb().collection('votacions');
    }

    public static async getAll(member)



    public static async get(userId: string): Promise<IUser | null> {
        return PollModel.getCollection().findOne({ userId });
    }

    public static async getAll(): Promise<Array<IUser>> {
        return PollModel.getCollection().find().toArray();
    }

    public static async updateMembership(
        userId: string,
        membership: Array<IMembership>,
    ): Promise<boolean> {
        const updateCount: number = (
            await PollModel.getCollection().updateOne(
                { userId },
                { $set: { membership } },
            )
        ).modifiedCount;
        return updateCount == 1;
    }

    public static async add(user: IUser): Promise<boolean> {
        try {
            await PollModel.getCollection().insertOne(user);
        } catch (e) {
            return false;
        }
        return true;
    }
}
