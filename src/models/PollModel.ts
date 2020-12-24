import { Collection, ObjectId } from 'mongodb';
import { IMembership } from '../interfaces/IUser';
import { IPoll, IPollState } from '../interfaces/IPoll';
import Database from '../providers/Database';

export default class PollModel {
    private static getCollection(): Collection {
        return Database.getDb().collection('votacions');
    }

    public static async getAll(
        membership: Array<IMembership>,
    ): Promise<Array<IPoll>> {
        return PollModel.getCollection()
            .find({ targetGroup: { $in: membership } })
            .toArray();
    }

    public static async get(_id: ObjectId): Promise<IPoll | null> {
        return PollModel.getCollection().findOne({ _id });
    }

    public static async add(poll: IPoll): Promise<boolean> {
        try {
            await PollModel.getCollection().insertOne(poll);
        } catch (e) {
            return false;
        }
        return true;
    }

    public static async setState(
        _id: ObjectId,
        state: IPollState,
    ): Promise<boolean> {
        const updateCount: number = (
            await PollModel.getCollection().updateOne(
                { _id },
                { $set: { state } },
            )
        ).modifiedCount;
        return updateCount == 1;
    }

    public static async delete(_id: ObjectId): Promise<boolean> {
        try {
            await PollModel.getCollection().deleteOne({ _id });
        } catch (e) {
            return false;
        }
        return true;
    }
}
