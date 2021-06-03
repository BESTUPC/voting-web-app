import { IVote } from '../domain';

export type CreateVoteRequestInterface = Omit<IVote, '_id' | 'userId'>;
