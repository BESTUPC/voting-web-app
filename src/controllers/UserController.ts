import {
    IMembership,
    isIGoogleUser,
    isIMembershipArray,
    IUser,
} from '../interfaces/IUser';
import ErrorHandler from '../models/ErrorHandler';
import UserModel from '../models/UserModel';

/**
 * Controller for the user-related calls. It handles all the logic between routing and the database access.
 */
export default class UserController {
    /**
     * If the user identified by userId1 is admin it updates the membership of the user identified by userId2 to the membership given.
     * @param userId1 id of the user making the request.
     * @param userId2 id of the poll.
     * @param body new membershep to set. It should be an array of valid [[IMembership]].
     * @returns Returns true if the membership could be set or false if otherwise and no errors arised.
     * @throws Error 400 if the body is not a valid membership array or missing.
     * @throws Error 401 if the user is not admin.
     */
    public static async updateMembership(
        userId1: string,
        userId2: string,
        body: unknown,
    ): Promise<boolean> {
        if (await UserController.isAdmin(userId1)) {
            if (!isIMembershipArray(body)) {
                throw new ErrorHandler(400, 'Bad request body');
            }
            const membership: Array<IMembership> = body;
            return UserModel.updateMembership(userId2, membership);
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }
    /**
     * Tries to add the user to the database.
     * @param body user to add, should be castable to [[IGoogleUser]].
     * @returns true if the user could be added or false if otherwise and no errors arised.
     * @throws Error 400 if the body is not a valid user.
     */
    public static async addUser(body: unknown): Promise<boolean> {
        if (!isIGoogleUser(body)) {
            throw new ErrorHandler(400, 'Bad request body');
        }
        const newUser: IUser = {
            userId: body.id,
            email: body.emails ? body.emails[0].value : 'notAvailable',
            name: body.displayName,
            membership: ['all'],
        };
        return UserModel.add(newUser);
    }

    /**
     * Returns the users if the requester is admin.
     * @param userId id of the user making the request.
     * @returns Returns an array with the users as [[IUser]].
     * @throws Error 401 if the user is not admin.
     */
    public static async getUsers(userId: string): Promise<Array<IUser>> {
        if (await UserController.isAdmin(userId)) {
            return UserModel.getAll();
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }

    /**
     * Returns the user requested.
     * @param userId1 id of the user making the request.
     * @param userId2 id of the user requested.
     * @returns Returns the user as [[IUser]].
     * @throws Error 401 if the user is not admin or the ids are not the same.
     */
    public static async getUser(
        userId1: string,
        userId2: string,
    ): Promise<IUser> {
        if ((await UserController.isAdmin(userId1)) || userId1 === userId2) {
            return UserModel.get(userId2);
        } else {
            throw new ErrorHandler(
                401,
                'Only admins or same users are authorized',
            );
        }
    }

    /**
     * Returns true if the user is admin, false otherwise.
     * @param userId id of the user.
     * @returns Returns true or false, according to the membership status of the user.
     */
    public static async isAdmin(userId: string): Promise<boolean> {
        return (await UserModel.get(userId)).membership.includes('admin');
    }
}
