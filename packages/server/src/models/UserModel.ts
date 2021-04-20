import { Collection } from 'mongodb';
import { EMembership, IUser } from '../interfaces/IUser';
import { Database } from '../providers/Database';

/**
 * Class for communication between controller and users database.
 */
export class UserModel {
    /**
     * Auxiliary function to get the right collection.
     */
    private static _getCollection(): Collection {
        return Database.getDb().collection('users');
    }

    /**
     * Get the user.
     * @param userId googleId of the user to get.
     * @returns Returns the requested user or null if not found.
     */
    public static async get(userId: string): Promise<IUser | null> {
        return UserModel._getCollection().findOne({ userId });
    }

    /**
     * Gets all the users.
     * @returns Returns an array of users.
     */
    public static async getAll(): Promise<Array<IUser>> {
        return UserModel._getCollection().find().toArray();
    }

    /**
     * Change the user membership.
     * @param userId id of the user to modify.
     * @param membership array of memberships to set to the user.
     * @returns Returns true if updated, false otherwise.
     */
    public static async updateMembership(
        userId: string,
        membership: Array<EMembership>,
    ): Promise<boolean> {
        const updateCount: number = (
            await UserModel._getCollection().updateOne(
                { userId },
                { $set: { membership: membership } },
            )
        ).modifiedCount;
        return updateCount == 1;
    }

    /**
     * Add the user.
     * @param user user object to add.
     * @returns Returns true if added, false otherwise.
     */
    public static async add(user: IUser): Promise<boolean> {
        try {
            await UserModel._getCollection().insertOne(user);
        } catch (e) {
            return false;
        }
        return true;
    }
}
