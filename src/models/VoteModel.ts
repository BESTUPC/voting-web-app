import { Collection } from 'mongodb';
import { IVote } from '../interfaces/IVote';
import Database from '../providers/Database';

/**
 * Class for communication between controller and votes database.
 */
export default class VoteModel {
    /**
     * Auxiliary function to get the right collection.
     */
    private static _getCollection(): Collection {
        return Database.getDb().collection('votes');
    }

    /**
     * Get the user.
     * @param userId googleId of the vote's user.
     * @param pollId id of the vote's poll.
     * @returns Returns the requested poll or null if not found.
     */
    public static async get(
        userId: string,
        pollId: string,
    ): Promise<IVote | null> {
        return VoteModel._getCollection().findOne({ userId, pollId });
    }

    /**
     * Add or update a vote.
     * @param userId googleId of the vote's user.
     * @param pollId id of the vote's poll.
     * @param option the option to set.
     * @param delegated the delegation option to set.
     * @returns Returns true if updated or set, false otherwise.
     */
    public static async addOrUpdateVote({
        userId,
        pollId,
        option,
        delegated,
    }: IVote): Promise<boolean> {
        const updateCount: number = (
            await VoteModel._getCollection().updateOne(
                { userId, pollId },
                { $set: { option, delegated } },
                { upsert: true },
            )
        ).modifiedCount;
        return updateCount == 1;
    }
}
