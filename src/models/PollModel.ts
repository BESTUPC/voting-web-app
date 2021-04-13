import { Collection, ObjectId } from 'mongodb';
import { EMembership } from '../interfaces/IUser';
import { IPoll, EPollState } from '../interfaces/IPoll';
import { Database } from '../providers/Database';

/**
 * Class for communication between controller and polls database.
 */
export class PollModel {
    /**
     * Auxiliary function to get the right collection.
     */
    private static _getCollection(): Collection {
        return Database.getDb().collection('votacions');
    }

    /**
     * Gets all the polls that contain the given membership.
     * @param membership membership to filter the polls with.
     * @returns Returns an array of polls.
     */
    public static async getAll(
        membership: Array<EMembership>,
    ): Promise<Array<IPoll>> {
        return PollModel._getCollection()
            .find({ targetGroup: { $in: membership } })
            .toArray();
    }

    /**
     * Get the poll.
     * @param _id id of the poll to obtain.
     * @returns Returns the requested poll or null if not found.
     */
    public static async get(_id: ObjectId): Promise<IPoll | null> {
        return PollModel._getCollection().findOne({ _id });
    }

    /**
     * Add the poll.
     * @param poll poll object to add.
     * @returns Returns true if added, false otherwise.
     */
    public static async add(poll: IPoll): Promise<boolean> {
        try {
            await PollModel._getCollection().insertOne(poll);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Change the poll state.
     * @param _id id of the poll to modify.
     * @param state state to set the poll to.
     * @returns Returns true if updated, false otherwise.
     */
    public static async setState(
        _id: ObjectId,
        state: EPollState,
    ): Promise<boolean> {
        const updateCount: number = (
            await PollModel._getCollection().updateOne(
                { _id },
                { $set: { state } },
            )
        ).modifiedCount;
        return updateCount == 1;
    }

    /**
     * Delete the poll.
     * @param _id  id of the poll to delete.
     * @returns Returns true if deleted, false otherwise.
     */
    public static async delete(_id: ObjectId): Promise<boolean> {
        try {
            await PollModel._getCollection().deleteOne({ _id });
        } catch (e) {
            return false;
        }
        return true;
    }
}
