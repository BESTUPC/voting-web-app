import { Collection } from 'mongodb';
import { IMembership, IUser } from '../interface/IUser';
import Database from '../providers/Database';

export default class UserModel {
    private static getCollection(): Collection {
        return Database.getDb().collection('users');
    }
    public static async get(userId: string): Promise<IUser | null> {
        return UserModel.getCollection().findOne({ userId });
    }

    public static async getAll(): Promise<Array<IUser>> {
        return UserModel.getCollection().find().toArray();
    }

    public static async updateMembership(
        userId: string,
        membership: Array<IMembership>,
    ): Promise<boolean> {
        const updateCount: number = (
            await UserModel.getCollection().updateOne(
                { userId },
                { $set: { membership: membership } },
            )
        ).modifiedCount;
        return updateCount == 1;
    }

    public static async add(user: IUser): Promise<boolean> {
        try {
            await UserModel.getCollection().insertOne(user);
        } catch (e) {
            return false;
        }
        return true;
    }
}
