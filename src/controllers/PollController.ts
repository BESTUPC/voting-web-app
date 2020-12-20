import { ObjectId } from 'mongodb';
import { IPoll, IPollState } from '../interface/IPoll';
import { IMembership, IUser } from '../interface/IUser';
import ErrorHandler from '../models/ErrorHandler';
import PollModel from '../models/PollModel';
import UserController from './UserController';

export default class PollController {
    public static async getPolls(userId: string): Promise<Array<IPoll>> {
        const user: IUser = await UserController.getUser(userId);
        return PollModel.getAll(user.membership);
    }

    public static async getPoll(userId: string, _id: string): Promise<IPoll> {
        const user: IUser = await UserController.getUser(userId);
        const poll: IPoll = await PollModel.get(new ObjectId(_id));
        if (user.membership.includes(poll.targetGroup)) {
            return poll;
        } else {
            throw new ErrorHandler(401, 'Not authorized to see get this poll');
        }
    }

    public static async updateState(
        userId: string,
        _id: string,
        body: { state: IPollState },
    ): Promise<boolean> {
        if (await UserController.isAdmin(userId)) {
            let state: IPollState;
            try {
                state = body.state;
                if (!state) {
                    throw new ErrorHandler(400, 'Bad request body');
                }
            } catch {
                throw new ErrorHandler(400, 'Bad request body');
            }
            return PollModel.setState(new ObjectId(_id), state);
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }

    public static async addPoll(
        userId: string,
        body: {
            description: string;
            isPriority: boolean;
            isPrivate: boolean;
            pollDeadline: number;
            state: IPollState;
            targetGroup: IMembership;
            pollOptions: Array<string>;
            pollName: string;
        },
    ): Promise<boolean> {
        if (await UserController.isAdmin(userId)) {
            let newPoll: IPoll;
            try {
                newPoll = body;
                if (!Object.values(newPoll).every((item) => item)) {
                    throw new ErrorHandler(400, 'Bad request body');
                }
                return PollModel.add(newPoll);
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
