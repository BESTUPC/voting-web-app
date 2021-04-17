import { ObjectId } from 'mongodb';
import { validatorGeneric } from '../dtos/GenericDTOValidator';
import { VoteAddDTO } from '../dtos/VoteAddDTO';
import {
    EPollApprovalRatio,
    EPollState,
    IPoll,
    IPollOption,
} from '../interfaces/IPoll';
import { IUser } from '../interfaces/IUser';
import { IVote } from '../interfaces/IVote';
import { PollModel } from '../models/PollModel';
import { UserModel } from '../models/UserModel';
import { VoteModel } from '../models/VoteModel';
import { ErrorHandler } from '../utils/ErrorHandler';
import { DelegationController } from './DelegationController';
import { PollController } from './PollController';
import { UserController } from './UserController';

/**
 * Controller for the poll-related calls. It handles all the logic between routing and the database access.
 */
export class VoteController {
    /**
     * It returns the vote with the ids provided. More precisely, the vote (if it exists) will be returned if:
     *  * The poll is public and the user making the request has access to the poll.
     *  * The poll is private and the user making the request is the same as the vote's user and it has access to the poll.
     *
     * @param userId1 id of the user making the request.
     * @param userId2 id of the vote's user to get.
     * @param pollId id of the poll.
     * @returns Returns the vote requested or null.
     * @throws Error 401 if the user is not authorized to get that vote or poll.
     * @throws Error 404 if the user or poll or vote is not found.
     */
    public static async getVote(
        userId1: string,
        userId2: string,
        pollId: string,
    ): Promise<IVote> {
        const poll: IPoll = await PollController.getPoll(userId1, pollId);
        const delegationIds = (
            await DelegationController.getDelegation(userId1, userId1)
        ).map((user) => user.userId);
        if (
            (poll.isPrivate &&
                userId1 !== userId2 &&
                !delegationIds.includes(userId2)) ||
            (poll.isPrivate &&
                userId1 !== userId2 &&
                poll.state !== EPollState.OPEN)
        ) {
            throw new ErrorHandler(401, 'Not authorized to get this vote');
        } else {
            const vote = await VoteModel.get(userId2, pollId);
            if (!vote)
                throw new ErrorHandler(
                    404,
                    `Vote from user ${userId2} on poll ${pollId} not found.`,
                );
            return vote;
        }
    }

    /**
     * It deletes all votes to a particular poll.
     *
     * @param userId id of the user making the request.
     * @param pollId id of the poll.
     * @returns Returns the true if the votes could be deleted.
     * @throws Error 401 if the user is not authorized to delete the votes.
     */
    public static async deleteVotesByPollId(
        userId: string,
        pollId: string,
    ): Promise<boolean> {
        if (UserController.isAdmin(userId)) {
            throw new ErrorHandler(401, 'Not authorized to delete votes');
        }
        try {
            return VoteModel.deleteByPollId(pollId);
        } catch {
            throw new ErrorHandler(500, 'Somethinge went wrong.');
        }
    }

    /**
     * If the user making the request has access to the poll, is the same as the vote's user and the poll is open it adds or updates the vote.
     * @param userId id of the user making the request.
     * @param body vote to add or update. It should be a valid [[IVote]].
     * @param delegatedId id of the user who we will vote for.
     * @returns true if the vote could be added/updated or false if otherwise and no errors arised.
     * @throws Error 400 if the body is not a valid vote or missing.
     * @throws Error 401 if the user is not the same or has no access or the poll is closed or the delegation is not present.
     * @throws Error 404 if the user or poll is not found.
     */
    public static async addorUpdateVote(
        userId: string,
        body: unknown,
        delegatedId?: string,
    ): Promise<boolean> {
        const auxUserId = !delegatedId ? userId : delegatedId;
        const vote: IVote = {
            ...(await validatorGeneric<VoteAddDTO>(VoteAddDTO, body)),
            userId: auxUserId,
        };
        if (
            delegatedId &&
            !(await DelegationController.check(userId, delegatedId))
        ) {
            throw new ErrorHandler(401, "The delegation doesn't exist");
        }

        const poll = await PollController.getPoll(auxUserId, vote.pollId);
        if (poll.state !== 'open') {
            throw new ErrorHandler(401, 'Poll is now closed');
        }

        return await VoteModel.addOrUpdateVote(vote);
    }

    private static async getNormalResults(
        pollId: string,
        options: IPollOption[],
        isPrivate: boolean,
        _approvalRatio: EPollApprovalRatio,
        abstentionIsValid: boolean,
    ): Promise<{
        votes: Array<[string, number]>;
        voters: Array<[string, string[]]>;
        winner: string;
    }> {
        const votesFound: IVote[] = await VoteModel.getFromPollId(pollId);
        const users: IUser[] = await UserModel.getAll();
        const votes: Array<[string, number]> = [];
        let voters: Array<[string, string[]]> = [];
        for (const option of options) {
            const votesOption = votesFound.filter(
                (vote) => vote.option[0] === option.name,
            );
            const userIdsOption = votesOption.map((opt) => opt.userId);
            const usersOption = users.filter((user) =>
                userIdsOption.includes(user.userId),
            );
            const voter: [string, string[]] = [
                option.name,
                usersOption.map((user) => user.name),
            ];
            const vote: [string, number] = [option.name, votesOption.length];
            votes.push(vote);
            voters.push(voter);
        }
        //const againstOptions = options.filter((opt) => opt.isAgainst);
        const abstentionOptions = options.filter((opt) => opt.isAbstention);

        const nValidVotes =
            votes.length - (abstentionIsValid ? 0 : abstentionOptions.length);

        let winner = '';

        for (const vote of votes) {
            if (vote[1] / nValidVotes > 0.5) {
                winner = vote[0];
            }
        }

        if (isPrivate) {
            voters = [
                [
                    'Voters',
                    voters.reduce((acc: string[], curr) => {
                        return acc.concat(curr[1]);
                    }, []),
                ],
            ];
        }
        return { votes, voters, winner };
    }
    private static async getPriorityResults(
        _pollId: string,
        _options: IPollOption[],
        _isPrivate: boolean,
    ): Promise<{
        votes: Array<[string, number]>;
        voters: Array<[string, string[]]>;
        winner: string;
    }> {
        return { votes: [], voters: [], winner: '' };
    }

    public static async getResults(
        userId: string,
        pollId: string,
    ): Promise<{
        votes: Array<[string, number]>;
        voters: Array<[string, string[]]>;
        winner: string;
    }> {
        const poll: IPoll = await PollModel.get(new ObjectId(pollId));
        if (poll) {
            throw new ErrorHandler(404, 'Poll not found');
        }
        if (
            poll.state === EPollState.OPEN ||
            (poll.state === EPollState.CLOSED_HIDDEN &&
                !(await UserController.isAdmin(userId)))
        ) {
            throw new ErrorHandler(
                401,
                'Not authorized to access results in the current state',
            );
        }
        if (poll.isPriority) {
            return this.getPriorityResults(
                pollId,
                poll.pollOptions,
                poll.isPrivate,
            );
        }
        return this.getNormalResults(
            pollId,
            poll.pollOptions,
            poll.isPrivate,
            poll.approvalRatio,
            poll.abstentionIsValid,
        );
    }
}
