import { validatorGeneric } from '../dtos/GenericDTOValidator';
import { VoteAddDTO } from '../dtos/VoteAddDTO';
import { IPoll } from '../interfaces/IPoll';
import { IVote } from '../interfaces/IVote';
import VoteModel from '../models/VoteModel';
import ErrorHandler from '../utils/ErrorHandler';
import DelegationController from './DelegationController';
import PollController from './PollController';

/**
 * Controller for the poll-related calls. It handles all the logic between routing and the database access.
 */
export default class VoteController {
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
        console.log(pollId);
        const poll: IPoll = await PollController.getPoll(userId1, pollId);
        if (poll.isPrivate && userId1 !== userId2) {
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
}
