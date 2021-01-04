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
     * Gets all the delegated votes for a poll.
     * @param pollId id of the votes' poll.
     * @returns Returns an array of votes.
     */
    public static async getAllDelegated(pollId: string): Promise<Array<IVote>> {
        return VoteModel._getCollection()
            .find({ userId: /^delegation_/, pollId })
            .toArray();
    }

    /**
     * Removes all the delegated votes for a poll.
     * @param pollId id of the votes' poll.
     * @returns Returns true if removed, false otherwise.
     */
    public static async removeAllDelegated(pollId: string): Promise<boolean> {
        try {
            await VoteModel._getCollection().deleteMany({
                userId: /^delegation_/,
                pollId,
            });
        } catch {
            return false;
        }
        return true;
    }

    /**
     * Add or update a vote.
     * @param userId googleId of the vote's user.
     * @param pollId id of the vote's poll.
     * @param option the option to set.
     * @returns Returns true if updated or set, false otherwise.
     */
    public static async addOrUpdateVote(
        userId: string,
        pollId: string,
        option: string,
    ): Promise<boolean> {
        const updateCount: number = (
            await VoteModel._getCollection().updateOne(
                { userId, pollId },
                { $set: { option } },
                { upsert: true },
            )
        ).modifiedCount;
        return updateCount == 1;
    }
}
