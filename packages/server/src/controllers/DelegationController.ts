import { ObjectId } from 'mongodb';
import { DelegationModel } from '../models/DelegationModel';
import { UserModel } from '../models/UserModel';
import { ErrorHandler } from '../utils/ErrorHandler';
import { UserController } from './UserController';
import { IDelegation, IUser } from 'interfaces';

/**
 * Controller for the delegation-related calls. It handles all the logic between routing and the database access.
 */
export class DelegationController {
    /**
     * Returns all the delegations if the user is admin.
     * @param userId id of the user making the request.
     * @returns Returns an array with the polls.
     * @throws Error 404 if the user is not found.
     * @throws Error 401 if the user is not admin.
     */
    public static async getDelegations(userId: string): Promise<Array<IDelegation>> {
        if (await UserController.isAdmin(userId)) return DelegationModel.getAll();
        else throw new ErrorHandler(401, 'Not authorized to get all delegations');
    }

    /**
     * Chechs if the delegation exists.
     * @param userIdReceiver id of the user who receives the delegation.
     * @param userIdDelegator id of the user who gives the delegation.
     * @returns
     */
    public static async check(userIdReceiver: string, userIdDelegator: string): Promise<boolean> {
        return DelegationModel.check(userIdReceiver, userIdDelegator);
    }

    /**
     * If the user1 is admin and the user2 and user3 are not delegated, it creates a delegation for user3 on user2 (user3 can vote for user2).
     * @param userId1 id of the user making the request.
     * @param userId2 id of the user who will give the delegation.
     * @param userId3 id of the user who will receive the delegation.
     * @returns Returns the true if delegation is created.
     * @throws Error 401 if the user1 is not admin.
     * @throws Error 404 if the user1 is not found.
     * @throws Error 400 if the user2 and user3 are the same.
     */
    public static async giveDelegation(
        userId1: string,
        userId2: string,
        userId3: string,
    ): Promise<boolean> {
        if (userId2 === userId3) {
            throw new ErrorHandler(400, 'Cannot give delegation to oneself');
        }
        if ((await DelegationModel.find(userId2)) || (await DelegationModel.find(userId3))) {
            throw new ErrorHandler(
                409,
                'The delegation already exists or would cause a circular delegation',
            );
        }
        if (await UserController.isAdmin(userId1)) {
            return DelegationModel.add(userId2, userId3);
        } else {
            throw new ErrorHandler(401, 'Not authorized or allowed to add the delegation');
        }
    }
    /**
     * If the user is admin or trying to access his own delegation, it returns the delegations.
     * @param userId1 id of the user making the request.
     * @param userId2 id of the user whose delegation we want.
     * @returns Returns the users for which the user identified by userId2 has delegations.
     * @throws Error 401 if the user is not authorized to get the delegation.
     * @throws Error 404 if the user1 is not found.
     */
    public static async getDelegationReceiver(
        userId1: string,
        userId2: string,
    ): Promise<Array<IUser>> {
        if (userId1 === userId2 || (await UserController.isAdmin(userId1))) {
            const delegations = (await DelegationModel.getReceiver(userId2)).map(
                (delegation) => delegation.userIdDelegator,
            );
            return (await UserModel.getAll()).filter((user) => delegations.includes(user.userId));
        } else {
            throw new ErrorHandler(401, 'Not authorized to get the delegation');
        }
    }

    /**
     * If the user is admin or trying to access it's own received delegations, it returns the delegations.
     * @param userId1 id of the user making the request.
     * @param userId2 id of the user whose delegation we want.
     * @returns Returns the users for which the user identified by userId2 has delegations.
     * @throws Error 401 if the user is not authorized to get the delegation.
     * @throws Error 404 if the user1 is not found.
     */
    public static async getDelegationDelegator(
        userId1: string,
        userId2: string,
    ): Promise<Array<IUser>> {
        if (userId1 === userId2 || (await UserController.isAdmin(userId1))) {
            const delegations = (await DelegationModel.getDelegator(userId2)).map(
                (delegation) => delegation.userIdReceiver,
            );
            return (await UserModel.getAll()).filter((user) => delegations.includes(user.userId));
        } else {
            throw new ErrorHandler(401, 'Not authorized to get the delegation');
        }
    }

    /**
     * If the user is admin it adds deletes the given delegation from the database.
     * @param userId id of the user making the request.
     * @param _id id of the delegation to delete.
     * @returns true if the delegation could be deleted or false if otherwise and no errors arised.
     * @throws Error 400 if the body is not a valid state or missing.
     * @throws Error 401 if the user is not admin.
     * @throws Error 404 if the user is not found.
     */
    public static async deleteDelegation(userId: string, _id: string): Promise<boolean> {
        if (await UserController.isAdmin(userId)) {
            return DelegationModel.delete(new ObjectId(_id));
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }

    /**
     * If the user is admin it deletes all the delegations from the database.
     * @param userId id of the user making the request.
     * @returns true if the delegations could be deleted or false if otherwise and no errors arised.
     * @throws Error 400 if the body is not a valid state or missing.
     * @throws Error 401 if the user is not admin.
     * @throws Error 404 if the user is not found.
     */
    public static async deleteDelegations(userId: string): Promise<boolean> {
        if (await UserController.isAdmin(userId)) {
            return DelegationModel.removeAll();
        } else {
            throw new ErrorHandler(401, 'Only admins are authorized');
        }
    }
}
