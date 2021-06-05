import { IPoll, IUser } from '../domain';

export type CreatePollBody = IPoll;

export type GetPollsResponse = IPollWithVotes[];
export type GetPollResponse = IPollWithVotes;

export type VoteMap = { user: IUser; voted: string[]; delegated: boolean }[];

export type IPollWithVotes = IPoll & { voteMap: VoteMap };