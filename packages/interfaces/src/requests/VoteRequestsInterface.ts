import { IVote } from '../domain';

export type CreateVoteRequestInterface = Omit<IVote, '_id' | 'userId'>;

export interface ResultsInterface {
    votes: Array<{ option: string; votes: number }>;
    voters: Array<[string, string[]]>;
    winner: string;
}
