import { ObjectId } from 'mongodb';

/**
 * Interface for the vote saved in the database.
 */
export interface IVote {
    _id?: ObjectId;
    userId: string;
    pollId: string;
    option: string[];
}
