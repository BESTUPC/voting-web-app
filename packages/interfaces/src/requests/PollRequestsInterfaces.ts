import { IPoll } from '../domain';

export type CreatePollBody = IPoll;

export type GetPollsResponse = IPollWithVotes[];
export type GetPollResponse = IPollWithVotes;

export type VoteMap = { user: string; voted: boolean }[];

export type IPollWithVotes = IPoll & { voteMap: VoteMap };
