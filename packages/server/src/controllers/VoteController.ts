import {
    EPollApprovalRatio,
    EPollState,
    IPoll,
    IPollOption,
    IUser,
    IVote,
    ResultsInterface,
} from 'interfaces';
import { ObjectId } from 'mongodb';
import { validatorGeneric } from '../dtos/GenericDTOValidator';
import { VoteAddDTO } from '../dtos/VoteAddDTO';
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
     * @param pollInternal if we already have the poll we pass it here. Used for getPoll and getPolls.
     * @returns Returns the vote requested or null.
     * @throws Error 401 if the user is not authorized to get that vote or poll.
     */
    public static async getVote(
        userId1: string,
        userId2: string,
        pollId: string,
        pollInternal?: IPoll,
    ): Promise<IVote> {
        let poll: IPoll;
        if (!!pollInternal) {
            poll = pollInternal;
        } else {
            poll = await PollController.getPoll(userId1, pollId);
        }
        const existsDelegation = await DelegationController.check(userId1, userId2);
        if (
            poll.isPrivate &&
            userId1 !== userId2 &&
            (!existsDelegation || (existsDelegation && poll.state !== EPollState.OPEN))
        ) {
            throw new ErrorHandler(401, 'Not authorized to get this vote');
        } else {
            const vote = await VoteModel.get(userId2, pollId);
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
    public static async deleteVotesByPollId(userId: string, pollId: string): Promise<boolean> {
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
        if (delegatedId && !(await DelegationController.check(userId, delegatedId))) {
            throw new ErrorHandler(401, "The delegation doesn't exist");
        }

        const poll = await PollController.getPoll(auxUserId, vote.pollId);
        if (poll.state !== EPollState.OPEN) {
            throw new ErrorHandler(401, 'Poll is now closed');
        }

        return await VoteModel.addOrUpdateVote(vote);
    }

    private static async getNormalResults(
        votesFound: IVote[],
        options: IPollOption[],
        isPrivate: boolean,
        approvalRatio: EPollApprovalRatio,
        abstentionIsValid: boolean,
    ): Promise<ResultsInterface> {
        const users: IUser[] = await UserModel.getAll();
        const votes: Array<{ option: string; votes: number }> = [];
        let voters: Array<[string, string[]]> = [];
        for (const option of options) {
            const votesOption = votesFound.filter((vote) => vote.option[0] === option.name);
            const userIdsOption = votesOption.map((opt) => opt.userId);
            const usersOption = users.filter((user) => userIdsOption.includes(user.userId));
            const voter: [string, string[]] = [option.name, usersOption.map((user) => user.name)];
            const vote: { option: string; votes: number } = {
                option: option.name,
                votes: votesOption.length,
            };
            votes.push(vote);
            voters.push(voter);
        }
        const abstentionOptions = options.filter((opt) => opt.isAbstention);

        const nValidVotes = votes.length - (abstentionIsValid ? 0 : abstentionOptions.length);

        let winner = '';
        const votesSorted = votes
            .sort((a, b) => b.votes - a.votes)
            .filter((v) => {
                const found = options.find((opt) => opt.name === v.option);
                return abstentionIsValid || !found.isAbstention;
            });

        if (votesSorted.length === 0) {
            winner = 'There is no winner';
        } else {
            if (approvalRatio === EPollApprovalRatio.SIMPLE) {
                winner =
                    votesSorted.length === 1 || votesSorted[0].votes !== votesSorted[1].votes
                        ? `The winner of the poll is ${votesSorted[0].option}`
                        : 'There is no winner';
            } else if (approvalRatio === EPollApprovalRatio.ABSOLUTE) {
                winner =
                    votesSorted[0].votes / nValidVotes > 0.5
                        ? `The winner of the poll is ${votesSorted[0].option}`
                        : 'There is no winner';
            } else {
                winner =
                    votesSorted[0].votes / nValidVotes > 2 / 3
                        ? `The winner of the poll is ${votesSorted[0].option}!`
                        : `There is no winner`;
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
        return { votes, voters, winner, removed: [] };
    }
    private static async getPriorityResults(
        votesFound: IVote[],
        options: IPollOption[],
        isPrivate: boolean,
        approvalRatio: EPollApprovalRatio,
        abstentionIsValid: boolean,
    ): Promise<ResultsInterface[]> {
        const results: ResultsInterface[] = [];
        const done = false;
        let votesCurrent: IVote[] = votesFound;
        let optionsCurrent: IPollOption[] = options;
        while (!done) {
            const round = await this.getNormalResults(
                votesCurrent,
                optionsCurrent,
                isPrivate,
                approvalRatio,
                abstentionIsValid,
            );
            if (round.winner.includes('The winner of the poll is')) {
                results.push(round);
                return results;
            }
            const loosingSortedVotes = round.votes
                .sort((a, b) => a.votes - b.votes)
                .filter((o) => {
                    const option = options.find((oAux) => oAux.name === o.option);
                    return !option.isAgainst && !option.isAbstention;
                });
            if (loosingSortedVotes.length === round.votes.length) {
                results.push(round);
                return results;
            }
            const minVotes = loosingSortedVotes[loosingSortedVotes.length - 1].votes;

            const removeVotes = loosingSortedVotes
                .filter((v) => v.votes === minVotes)
                .map((v) => v.option);

            optionsCurrent = optionsCurrent.filter((o) => !removeVotes.includes(o.name));
            votesCurrent = votesCurrent.map((vc) => ({
                ...vc,
                option: vc.option.filter((o) => !removeVotes.includes(o)),
            }));
            round.removed = removeVotes;
            results.push(round);
        }

        return results;
    }

    public static async getResults(userId: string, pollId: string): Promise<ResultsInterface[]> {
        const poll: IPoll = await PollModel.get(new ObjectId(pollId));
        if (!poll) {
            throw new ErrorHandler(404, 'Poll not found');
        }
        if (
            poll.state === EPollState.OPEN ||
            (poll.state === EPollState.CLOSED_HIDDEN && !(await UserController.isAdmin(userId)))
        ) {
            throw new ErrorHandler(401, 'Not authorized to access results in the current state');
        }
        const votesFound: IVote[] = await VoteModel.getFromPollId(pollId);
        if (poll.isPriority) {
            return this.getPriorityResults(
                votesFound,
                poll.pollOptions,
                poll.isPrivate,
                poll.approvalRatio,
                poll.abstentionIsValid,
            );
        }
        return [
            await this.getNormalResults(
                votesFound,
                poll.pollOptions,
                poll.isPrivate,
                poll.approvalRatio,
                poll.abstentionIsValid,
            ),
        ];
    }
}
