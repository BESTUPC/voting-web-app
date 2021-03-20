import { ObjectId } from 'mongodb';
import { validatorGeneric } from '../dtos/GenericDTOValidator';
import { PollCreateDTO } from '../dtos/PollCreateDTO';
import { PollUpdateStateDTO } from '../dtos/PollUpdateStateDTO';
import { EPollState, IPoll } from '../interfaces/IPoll';
import { IUser } from '../interfaces/IUser';
import ErrorHandler from '../models/ErrorHandler';
import PollModel from '../models/PollModel';
import UserController from './UserController';

/**
 * Controller for the poll-related calls. It handles all the logic between routing and the database access.
 */
export default class PollController {
    /**
     * Returns the polls that the user's membership has permission to visualize.
     * @param userId id of the user making the request.
     * @returns Returns an array with the polls that the user can access.
     * @throws Error 404 if the user is not found.
     */
    public static async getPolls(userId: string): Promise<Array<IPoll>> {
        const user: IUser = await UserController.getUser(userId, userId);
        return PollModel.getAll(user.membership);
    }

    /**
     * If the user has the proper membership, it returns the poll with the id provided.
     * @param userId id of the user making the request.
     * @param _id id of the poll.
     * @returns Returns the poll requested.
     * @throws Error 401 if the user is not authorized to get that poll.
     * @throws Error 404 if the user or poll is not found.
     */
    public static async getPoll(userId: string, _id: string): Promise<IPoll> {
        const user: IUser = await UserController.getUser(userId, userId);
        const poll: IPoll = await PollModel.get(new ObjectId(_id));
        if (!poll) throw new ErrorHandler(404, `Poll ${_id} not found.`);
        if (user.membership.includes(poll.targetGroup)) {
            return poll;
        } else {
            throw new ErrorHandler(401, 'Not authorized to get this poll');
        }
    }

    /**
     * If the user is admin it updates the poll's state to the given new state.
     * @param userId id of the user making the request.
     * @param _id id of the poll.
     * @param body new state to set. It should be a valid [[IPollState]].
     * @returns Returns true if the state could be set or false if otherwise and no errors arised.
     * @throws Error 400 if the body is not a valid state or missing.
     * @throws Error 401 if the user is not admin.
     * @throws Error 404 if the user or poll is not found.
     */
    public static async updateState(
        userId: string,
        _id: string,
        body: unknown,
    ): Promise<boolean> {
        if (await UserController.isAdmin(userId)) {
            const state: EPollState = (
                await validatorGeneric<PollUpdateStateDTO>(
                    PollUpdateStateDTO,
                    body,
                )
            ).state;
            const poll: IPoll = await PollModel.get(new ObjectId(_id));
            if (!poll) throw new ErrorHandler(404, `Poll ${_id} not found.`);
            return PollModel.setState(new ObjectId(_id), state);
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }

    /**
     * If the user is admin it adds the given poll to the database.
     * @param userId id of the user making the request.
     * @param body poll to add. It should be a valid [[IPoll]].
     * @returns true if the poll could be added or false if otherwise and no errors arised.
     * @throws Error 400 if the body is not a valid state or missing.
     * @throws Error 401 if the user is not admin.
     * @throws Error 404 if the user or poll is not found.
     */
    public static async addPoll(
        userId: string,
        body: unknown,
    ): Promise<boolean> {
        if (await UserController.isAdmin(userId)) {
            const poll: IPoll = {
                ...(await validatorGeneric<PollCreateDTO>(PollCreateDTO, body)),
                state: EPollState.OPEN,
            };
            return PollModel.add(poll);
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }
    /**
     * If the user is admin it deletes the given poll from the database.
     * @param userId id of the user making the request.
     * @param _id id of the poll to delete.
     * @returns true if the poll could be deleted or false if otherwise and no errors arised.
     * @throws Error 400 if the body is not a valid state or missing.
     * @throws Error 401 if the user is not admin.
     * @throws Error 404 if the user or poll is not found.
     */
    public static async deletePoll(
        userId: string,
        _id: string,
    ): Promise<boolean> {
        if (await UserController.isAdmin(userId)) {
            const poll: IPoll = await PollModel.get(new ObjectId(_id));
            if (!poll) throw new ErrorHandler(404, `Poll ${_id} not found.`);
            return PollModel.delete(new ObjectId(_id));
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }
}
