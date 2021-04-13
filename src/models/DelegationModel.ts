import { Collection, ObjectId } from 'mongodb';
import { IDelegation } from '../interfaces/IDelegation';
import { Database } from '../providers/Database';

/**
 * Class for communication between controller and delegations database.
 */
export class DelegationModel {
    /**
     * Auxiliary function to get the right collection.
     */
    private static _getCollection(): Collection {
        return Database.getDb().collection('delegations');
    }

    /**
     * Get the delegations a user has.
     * @param userIdReceiver googleId of the user.
     * @returns Returns the delegations a user has.
     */
    public static async get(
        userIdReceiver: string,
    ): Promise<Array<IDelegation>> {
        return DelegationModel._getCollection()
            .find({ userIdReceiver })
            .toArray();
    }

    /**
     * Check if the pair of id's matches a delegation.
     * @param userIdReceiver googleId of the receiver.
     * @param userIdDelegator googleId of the delegator.
     * @returns Returns if the delegation exists.
     */
    public static async check(
        userIdReceiver: string,
        userIdDelegator: string,
    ): Promise<boolean> {
        return (
            (await DelegationModel._getCollection().findOne({
                userIdReceiver,
                userIdDelegator,
            })) !== null
        );
    }

    /**
     * Gets all the delegations.
     * @returns Returns an array of delegations.
     */
    public static async getAll(): Promise<Array<IDelegation>> {
        return DelegationModel._getCollection().find().toArray();
    }

    /**
     * Removes all the delegations.
     * @returns Returns true if deleted, false otherwise.
     */
    public static async removeAll(): Promise<boolean> {
        try {
            await DelegationModel._getCollection().deleteMany({});
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Delete the delegation.
     * @param _id id of the delegation to delete.
     * @returns Returns true if deleted, false otherwise.
     */
    public static async delete(_id: ObjectId): Promise<boolean> {
        try {
            await DelegationModel._getCollection().deleteOne({ _id });
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Find if a user has given delegations.
     * @param userIdDelegator googleId of the user.
     * @returns Returns true if any delegations are found.
     */
    public static async find(userIdDelegator: string): Promise<boolean> {
        const delegations: Array<IDelegation> = await DelegationModel._getCollection()
            .find({ userIdDelegator })
            .toArray();
        return delegations.length !== 0;
    }

    /**
     * Add the delegation.
     * @param userIdDelegator id of the user who will receive the delegation.
     * @param userIdReceiver id of the user who will give the delegation.
     * @returns Returns true if added, false otherwise.
     */
    public static async add(
        userIdDelegator: string,
        userIdReceiver: string,
    ): Promise<boolean> {
        try {
            await DelegationModel._getCollection().insertOne({
                userIdDelegator,
                userIdReceiver,
            });
        } catch (e) {
            return false;
        }
        return true;
    }
}
