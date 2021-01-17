import { ObjectId } from 'mongodb';

/**
 * Interface for the vote saved in the database.
 */
export interface IVote {
    _id?: ObjectId;
    userId: string;
    pollId: string;
    option: string | string[];
    delegated: boolean;
}

/**
 * Typeguard for [[IVote]].
 * @param x object to check.
 */
export function isIVote(x: unknown): x is IVote {
    const y: IVote = x as IVote;
    return (
        y.userId !== undefined &&
        y.pollId !== undefined &&
        y.option !== undefined &&
        y.delegated !== undefined
    );
}
