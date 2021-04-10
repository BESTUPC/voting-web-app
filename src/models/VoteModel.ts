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
     * Get the vote.
     * @param userId googleId of the vote's user.
     * @param pollId id of the vote's poll.
     * @returns Returns the requested vote or null if not found.
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
    }: IVote): Promise<boolean> {
        const updateCount: number = (
            await VoteModel._getCollection().updateOne(
                { userId, pollId },
                { $set: { option } },
                { upsert: true },
            )
        ).modifiedCount;
        return updateCount == 1;
    }

    /**
     * Delete the votes by poll id.
     * @param pollId id of the vote's poll.
     * @param option the option to set.
     * @returns Returns true if deleted, false otherwise.
     */
    public static async deleteByPollId(pollId: string): Promise<boolean> {
        const updateCount: number = (
            await VoteModel._getCollection().deleteMany({ pollId })
        ).deletedCount;
        return updateCount == 1;
    }
}
