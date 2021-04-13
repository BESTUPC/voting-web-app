import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { ObjectId } from 'mongodb';
import sinon, { SinonSandbox } from 'sinon';
import { DelegationController } from '../../src/controllers/DelegationController';
import { UserController } from '../../src/controllers/UserController';
import { IDelegation } from '../../src/interfaces/IDelegation';
import { EMembership, IUser } from '../../src/interfaces/IUser';
import { DelegationModel } from '../../src/models/DelegationModel';
import { UserModel } from '../../src/models/UserModel';

chai.use(chaiAsPromised);

let sandbox: SinonSandbox;
describe('DelegationController', () => {
    describe('getDelegations', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });

        it('should call the get all function', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const delegations: IDelegation[] = [
                { userIdDelegator: 'id1', userIdReceiver: 'id2' },
            ];
            const getAllStub = sandbox
                .stub(DelegationModel, 'getAll')
                .resolves(delegations);
            const id = 'id';
            const response = await DelegationController.getDelegations(id);
            expect(response).to.deep.equal(delegations);
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(id);
            expect(getAllStub.calledOnce).to.be.true;
        });
        it('should return an unauthorized error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            const id = 'id';
            await expect(
                DelegationController.getDelegations(id),
            ).to.be.rejectedWith('Not authorized to get all delegations');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(id);
        });
    });
    describe('check', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });

        it('should call the check function', async () => {
            const ret = true;
            const checkStub = sandbox
                .stub(DelegationModel, 'check')
                .resolves(ret);
            const id1 = 'id1';
            const id2 = 'id2';
            const response = await DelegationController.check(id1, id2);
            expect(response).to.equal(ret);
            expect(checkStub.calledOnce).to.be.true;
            expect(checkStub.firstCall.args[0]).to.equal(id1);
            expect(checkStub.firstCall.args[1]).to.equal(id2);
        });
    });
    describe('giveDelegation', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });

        it('should return a user because it would be giving oneself a delegation', async () => {
            const reqId = 'reqId';
            const id1 = 'id';
            const id2 = 'id';
            await expect(
                DelegationController.giveDelegation(reqId, id1, id2),
            ).to.be.rejectedWith('Cannot give delegation to oneself');
        });
        it('should return existing or circular delegation error', async () => {
            const reqId = 'reqId';
            const id1 = 'id1';
            const id2 = 'id2';
            const findStub = sandbox
                .stub(DelegationModel, 'find')
                .resolves(true);
            await expect(
                DelegationController.giveDelegation(reqId, id1, id2),
            ).to.be.rejectedWith(
                'The delegation already exists or would cause a circular delegation',
            );
            expect(findStub.calledOnce).to.be.true;
            expect(findStub.firstCall.args[0]).to.equal(id1);
        });
        it('should return existing or circular delegation error', async () => {
            const reqId = 'reqId';
            const id1 = 'id1';
            const id2 = 'id2';
            const findStub = sandbox
                .stub(DelegationModel, 'find')
                .onFirstCall()
                .resolves(false)
                .onSecondCall()
                .resolves(true);
            await expect(
                DelegationController.giveDelegation(reqId, id1, id2),
            ).to.be.rejectedWith(
                'The delegation already exists or would cause a circular delegation',
            );
            expect(findStub.calledTwice).to.be.true;
            expect(findStub.firstCall.args[0]).to.equal(id1);
            expect(findStub.secondCall.args[0]).to.equal(id2);
        });
        it('should return unauthorized error', async () => {
            const reqId = 'reqId';
            const id1 = 'id1';
            const id2 = 'id2';
            const findStub = sandbox
                .stub(DelegationModel, 'find')
                .onFirstCall()
                .resolves(false)
                .onSecondCall()
                .resolves(false);
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            await expect(
                DelegationController.giveDelegation(reqId, id1, id2),
            ).to.be.rejectedWith(
                'Not authorized or allowed to add the delegation',
            );
            expect(findStub.calledTwice).to.be.true;
            expect(findStub.firstCall.args[0]).to.equal(id1);
            expect(findStub.secondCall.args[0]).to.equal(id2);
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(reqId);
        });
        it('should call the add model', async () => {
            const reqId = 'reqId';
            const id1 = 'id1';
            const id2 = 'id2';
            const findStub = sandbox
                .stub(DelegationModel, 'find')
                .onFirstCall()
                .resolves(false)
                .onSecondCall()
                .resolves(false);
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const addStub = sandbox.stub(DelegationModel, 'add').resolves(true);
            const response = await DelegationController.giveDelegation(
                reqId,
                id1,
                id2,
            );
            expect(response).to.be.true;
            expect(findStub.calledTwice).to.be.true;
            expect(findStub.firstCall.args[0]).to.equal(id1);
            expect(findStub.secondCall.args[0]).to.equal(id2);
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(reqId);
            expect(addStub.calledOnce).to.be.true;
            expect(addStub.firstCall.args[0]).to.equal(id1);
            expect(addStub.firstCall.args[1]).to.equal(id2);
        });
    });
    describe('getDelegation', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should return an unauthorized error because not admin', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            const id1 = 'id1';
            const id2 = 'id2';
            await expect(
                DelegationController.getDelegation(id1, id2),
            ).to.be.rejectedWith('Not authorized to get the delegation');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(id1);
        });
        it('should call the get functions', async () => {
            const delegations: IDelegation[] = [
                { userIdReceiver: 'id2', userIdDelegator: 'idOther' },
            ];
            const getStub = sandbox
                .stub(DelegationModel, 'get')
                .resolves(delegations);
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const users: IUser[] = [
                {
                    userId: 'idOther',
                    membership: [EMembership.ALL],
                    name: 'name',
                    email: 'email',
                },
            ];
            const getAllUsersStub = sandbox
                .stub(UserModel, 'getAll')
                .resolves(users);
            const id1 = 'id1';
            const id2 = 'idReq';
            const response = await DelegationController.getDelegation(id1, id2);
            expect(response).to.deep.equal(users);
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(id1);
            expect(getStub.calledOnce).to.be.true;
            expect(getStub.firstCall.args[0]).to.equal(id2);
            expect(getAllUsersStub.calledOnce).to.be.true;
        });
    });
    describe('deleteDelegation', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });

        it('should call the delete function', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);

            const deleteStub = sandbox
                .stub(DelegationModel, 'delete')
                .resolves(true);
            const userId = 'id';
            const _id = '0123456789AB';
            const response = await DelegationController.deleteDelegation(
                userId,
                _id,
            );
            expect(response).to.be.true;
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
            expect(deleteStub.calledOnce).to.be.true;
            expect(deleteStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
        });
        it('should return an unauthorized error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            const userId = 'id';
            const _id = '_id';
            await expect(
                DelegationController.deleteDelegation(userId, _id),
            ).to.be.rejectedWith('Only admins are authorized');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
    });
    describe('deleteDelegations', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });

        it('should call the deleteall function', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);

            const removeAllStub = sandbox
                .stub(DelegationModel, 'removeAll')
                .resolves(true);
            const userId = 'id';
            const response = await DelegationController.deleteDelegations(
                userId,
            );
            expect(response).to.be.true;
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
            expect(removeAllStub.calledOnce).to.be.true;
        });
        it('should return an unauthorized error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            const userId = 'id';
            await expect(
                DelegationController.deleteDelegations(userId),
            ).to.be.rejectedWith('Only admins are authorized');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
    });
});
