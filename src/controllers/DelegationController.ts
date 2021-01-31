import { ObjectId } from 'mongodb';
import { IDelegation } from '../interfaces/IDelegation';
import DelegationModel from '../models/DelegationModel';
import ErrorHandler from '../models/ErrorHandler';
import UserController from './UserController';

/**
 * Controller for the delegation-related calls. It handles all the logic between routing and the database access.
 */
export default class DelegationController {
    /**
     * Returns all the delegations if the user is admin.
     * @param userId id of the user making the request.
     * @returns Returns an array with the polls.
     * @throws Error 404 if the user is not found.
     * @throws Error 401 if the user is not admin.
     */
    public static async getDelegations(
        userId: string,
    ): Promise<Array<IDelegation>> {
        if (await UserController.isAdmin(userId))
            return DelegationModel.getAll();
        else
            throw new ErrorHandler(
                401,
                'Not authorized to get all delegations',
            );
    }

    /**
     * Returns all the delegations if the user is admin.
     * @param userId id of the user making the request.
     * @returns Returns an array with the polls.
     * @throws Error 404 if the user is not found.
     * @throws Error 401 if the user is not admin.
     */
    public static async check(
        userIdReceiver: string,
        userIdDelegator: string,
    ): Promise<boolean> {
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
     */
    public static async giveDelegation(
        userId1: string,
        userId2: string,
        userId3: string,
    ): Promise<boolean> {
        if (
            (await UserController.isAdmin(userId1)) &&
            !(await DelegationModel.find(userId2)) &&
            !(await DelegationModel.find(userId3))
        ) {
            return DelegationModel.add(userId2, userId3);
        } else {
            throw new ErrorHandler(
                401,
                'Not authorized or allowed to add the delegation',
            );
        }
    }
    /**
     * If the user is admin or trying to access it's own delegations, it returns the delegations.
     * @param userId1 id of the user making the request.
     * @param userId2 id of the user whose delegation we want.
     * @returns Returns the delegation requested.
     * @throws Error 401 if the user is not authorized to get the delegation.
     * @throws Error 404 if the user1 is not found.
     */
    public static async getDelegation(
        userId1: string,
        userId2: string,
    ): Promise<Array<IDelegation>> {
        if (userId1 === userId2 || (await UserController.isAdmin(userId1))) {
            return DelegationModel.get(userId2);
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
    public static async deleteDelegation(
        userId: string,
        _id: string,
    ): Promise<boolean> {
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
