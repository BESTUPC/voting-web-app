import { IMembership, IUser } from '../interface/IUser';
import ErrorHandler from '../models/ErrorHandler';
import UserModel from '../models/UserModel';

export default class UserController {
    public static async updateMembership(
        userId1: string,
        userId2: string,
        body: { membership: Array<IMembership> },
    ): Promise<boolean> {
        if (await UserController.isAdmin(userId1)) {
            let membership: Array<IMembership>;
            try {
                membership = body.membership;
                if (!membership) {
                    throw new ErrorHandler(400, 'Bad request body');
                }
            } catch {
                throw new ErrorHandler(400, 'Bad request body');
            }
            return UserModel.updateMembership(userId2, membership);
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }

    public static async addUser(body: {
        id: string;
        email: string;
        name: string;
    }): Promise<boolean> {
        let newUser: IUser;
        try {
            newUser = {
                userId: body.id,
                email: body.email,
                name: body.name,
                membership: ['all'],
            };
            if (!newUser.userId || !newUser.name || !newUser.email) {
                throw new ErrorHandler(400, 'Bad request body');
            }
        } catch {
            throw new ErrorHandler(400, 'Bad request body');
        }
        return UserModel.add(newUser);
    }

    public static async getUsers(userId: string): Promise<Array<IUser>> {
        if (await UserController.isAdmin(userId)) {
            return UserModel.getAll();
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }

    public static async getUser(userId: string): Promise<IUser> {
        return UserModel.get(userId);
    }

    public static async isAdmin(userId: string): Promise<boolean> {
        return (await UserModel.get(userId)).membership.includes('admin');
    }
}
