import { describe } from 'mocha';
import chai, { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

import UserController from '../../controllers/UserController';
import { IUser } from '../../interfaces/IUser';
import PollModel from '../../models/PollModel';
import { IPoll, IPollState } from '../../interfaces/IPoll';
import PollController from '../../controllers/PollController';
import { ObjectId } from 'mongodb';

let sandbox: SinonSandbox;
describe('PollController', () => {
    describe('test updateState', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should call the model's update state function", async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const setStateStub = sandbox
                .stub(PollModel, 'setState')
                .resolves(true);
            const userId1 = 'IdUser';
            const _id = '0123456789AB';
            const body: IPollState = 'closed';
            const ret: boolean = await PollController.updateState(
                userId1,
                _id,
                body,
            );
            expect(ret).to.be.true;
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
            expect(setStateStub.calledOnce).to.be.true;
            expect(setStateStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
            expect(setStateStub.firstCall.args[1]).to.equal(body);
        });
        it('should return a bad request error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId1 = 'IdUser';
            const _id = '0123456789AB';
            const body: IPollState = undefined;
            await expect(
                PollController.updateState(userId1, _id, body),
            ).to.be.rejectedWith('Bad request body');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
        });
        it('should return a bad request error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId1 = 'IdUser';
            const _id = '0123456789AB';
            const body = 'wrong';
            await expect(
                PollController.updateState(userId1, _id, body),
            ).to.be.rejectedWith('Bad request body');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
        });
        it('should return an unauthorized error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            const userId1 = 'IdUser';
            const _id = '0123456789AB';
            const body: IPollState = 'closed';
            await expect(
                PollController.updateState(userId1, _id, body),
            ).to.be.rejectedWith('Only admins are authorized');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
        });
    });
    describe('test addPoll', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should call the model's add function", async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const addStub = sandbox.stub(PollModel, 'add').resolves(true);
            const userId = 'IdUser';
            const body: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: 'open',
                targetGroup: 'all',
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name',
            };
            const ret: boolean = await PollController.addPoll(userId, body);
            expect(ret).to.be.true;
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
            expect(addStub.calledOnce).to.be.true;
            expect(addStub.firstCall.args[0]).to.deep.equal(body);
        });
        it('should return a bad request error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body: unknown = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: 'open',
                targetGroup: 'all',
                pollOptions: ['yes', 'no'],
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith('Bad request body');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return a bad request error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body: unknown = {
                wrongProperty: 'wrong',
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith('Bad request body');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return an unauthorized error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            const userId = 'IdUser';
            const body: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: 'open',
                targetGroup: 'all',
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name',
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith('Only admins are authorized');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
    });
    describe('test getPolls', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should call the model's get function", async () => {
            const user: IUser = {
                userId: 'ID',
                name: 'name1',
                email: 'email1',
                membership: ['all'],
            };
            const getUserStub = sandbox
                .stub(UserController, 'getUser')
                .resolves(user);
            const userId = 'ID';
            const poll1: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: 'open',
                targetGroup: 'all',
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name 1',
            };
            const poll2: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: 'open',
                targetGroup: 'all',
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name 2',
            };
            const getAllStub = sandbox
                .stub(PollModel, 'getAll')
                .resolves([poll1, poll2]);
            const ret: Array<IPoll> = await PollController.getPolls(userId);
            expect(ret).to.deep.equal([poll1, poll2]);
            expect(getUserStub.calledOnce).to.be.true;
            expect(getUserStub.firstCall.args[0]).to.equal(userId);
            expect(getUserStub.firstCall.args[1]).to.equal(userId);
            expect(getAllStub.calledOnce).to.be.true;
        });
    });
    describe('test getPoll', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should call the model's get function and return the poll", async () => {
            const user: IUser = {
                userId: 'ID',
                name: 'name',
                email: 'email',
                membership: ['all'],
            };
            const poll: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: 'open',
                targetGroup: 'all',
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name',
            };
            const getUserStub = sandbox
                .stub(UserController, 'getUser')
                .resolves(user);
            const getPollStub = sandbox.stub(PollModel, 'get').resolves(poll);
            const userId = 'ID';
            const _id = '0123456789AB';
            const ret: IPoll = await PollController.getPoll(userId, _id);
            expect(ret).to.deep.equal(poll);
            expect(getUserStub.calledOnce).to.be.true;
            expect(getUserStub.firstCall.args[0]).to.equal(userId);
            expect(getUserStub.firstCall.args[1]).to.equal(userId);
            expect(getPollStub.calledOnce).to.be.true;
            expect(getPollStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
        });
        it('should return an unauthorized error', async () => {
            const user: IUser = {
                userId: 'ID',
                name: 'name',
                email: 'email',
                membership: ['all'],
            };
            const poll: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: 'open',
                targetGroup: 'full',
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name',
            };
            const getUserStub = sandbox
                .stub(UserController, 'getUser')
                .resolves(user);
            const getPollStub = sandbox.stub(PollModel, 'get').resolves(poll);
            const userId = 'ID';
            const _id = '0123456789AB';
            await expect(
                PollController.getPoll(userId, _id),
            ).to.be.rejectedWith('Not authorized to get this poll');
            expect(getUserStub.calledOnce).to.be.true;
            expect(getUserStub.firstCall.args[0]).to.equal(userId);
            expect(getUserStub.firstCall.args[1]).to.equal(userId);
            expect(getPollStub.calledOnce).to.be.true;
            expect(getPollStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
        });
    });
    describe('test deletePoll', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should call the model's delete function", async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const deleteStub = sandbox.stub(PollModel, 'delete').resolves(true);
            const userId = 'ID';
            const _id = '0123456789AB';
            const ret: boolean = await PollController.deletePoll(userId, _id);
            expect(ret).to.equal(true);
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
            const userId = 'ID';
            const _id = '0123456789AB';
            await expect(
                PollController.deletePoll(userId, _id),
            ).to.be.rejectedWith('Only admins are authorized');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
    });
});
