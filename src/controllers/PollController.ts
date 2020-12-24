import { ObjectId } from 'mongodb';
import { IPoll, IPollState, isIPoll, isIPollState } from '../interface/IPoll';
import { IUser } from '../interface/IUser';
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
     * @returns the polls
     */
    public static async getPolls(userId: string): Promise<Array<IPoll>> {
        const user: IUser = await UserController.getUser(userId);
        return PollModel.getAll(user.membership);
    }

    /**
     * If the user has the proper membership, it returns the poll with the id provided.
     * @param userId id of the user making the request.
     * @param _id id of the poll.
     * @returns Promise<[[IPoll]]>>
     * @throws Error 401 if the user is not authorized to get that poll.
     */
    public static async getPoll(userId: string, _id: string): Promise<IPoll> {
        const user: IUser = await UserController.getUser(userId);
        const poll: IPoll = await PollModel.get(new ObjectId(_id));
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
     * @param body new state to set.
     * @returns Promise<boolean>
     * @throws Error 400 if the body is not a valid state or missing.
     * @throws Error 401 if the user is not admin.
     */
    public static async updateState(
        userId: string,
        _id: string,
        body: unknown,
    ): Promise<boolean> {
        if (await UserController.isAdmin(userId)) {
            if (!isIPollState(body)) {
                throw new ErrorHandler(400, 'Bad request body');
            }
            const state: IPollState = body;
            return PollModel.setState(new ObjectId(_id), state);
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }

    /**
     * 
     * @param userId id of the user making the request.
     * @param body poll to add.
     * @returns Promise<boolean>
     */
    public static async addPoll(
        userId: string,
        body: unknown,
    ): Promise<boolean> {
        if (await UserController.isAdmin(userId)) {
            try {
                if (!isIPoll(body)) {
                    throw new ErrorHandler(400, 'Bad request body');
                }
                return PollModel.add(body);
            } catch {
                throw new ErrorHandler(400, 'Bad request body');
            }
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }

    public static async deletePoll(
        userId: string,
        _id: string,
    ): Promise<boolean> {
        if (await UserController.isAdmin(userId)) {
            return PollModel.delete(new ObjectId(_id));
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }
}
