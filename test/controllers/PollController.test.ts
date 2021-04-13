import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { ObjectId } from 'mongodb';
import sinon, { SinonSandbox } from 'sinon';
import PollController from '../../src/controllers/PollController';
import UserController from '../../src/controllers/UserController';
import { EPollState, IPoll } from '../../src/interfaces/IPoll';
import { EMembership, IUser } from '../../src/interfaces/IUser';
import PollModel from '../../src/models/PollModel';

chai.use(chaiAsPromised);

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
            const poll: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name',
            };
            const getPollStub = sandbox.stub(PollModel, 'get').resolves(poll);
            const setStateStub = sandbox
                .stub(PollModel, 'setState')
                .resolves(true);
            const userId1 = 'IdUser';
            const _id = '0123456789AB';
            const ret: boolean = await PollController.updateState(userId1, _id);
            expect(ret).to.be.true;
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
            expect(getPollStub.calledOnce).to.be.true;
            expect(getPollStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
            expect(setStateStub.calledOnce).to.be.true;
            expect(setStateStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
        });
        it("should call the model's update state function", async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const poll: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.CLOSED_HIDDEN,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name',
            };
            const getPollStub = sandbox.stub(PollModel, 'get').resolves(poll);
            const setStateStub = sandbox
                .stub(PollModel, 'setState')
                .resolves(true);
            const userId1 = 'IdUser';
            const _id = '0123456789AB';
            const ret: boolean = await PollController.updateState(userId1, _id);
            expect(ret).to.be.true;
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
            expect(getPollStub.calledOnce).to.be.true;
            expect(getPollStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
            expect(setStateStub.calledOnce).to.be.true;
            expect(setStateStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
        });
        it('should not be able to update it', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const poll: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.CLOSED,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name',
            };
            const getPollStub = sandbox.stub(PollModel, 'get').resolves(poll);
            const userId1 = 'IdUser';
            const _id = '0123456789AB';
            await expect(
                PollController.updateState(userId1, _id),
            ).to.be.rejectedWith('Poll can not have any other states');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
            expect(getPollStub.calledOnce).to.be.true;
            expect(getPollStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
        });
        it('should return an unauthorized error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            const userId1 = 'IdUser';
            const _id = '0123456789AB';
            await expect(
                PollController.updateState(userId1, _id),
            ).to.be.rejectedWith('Only admins are authorized');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
        });
        it('should return a not found error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const getPollStub = sandbox.stub(PollModel, 'get').resolves(null);
            const userId1 = 'IdUser';
            const _id = '0123456789AB';
            await expect(
                PollController.updateState(userId1, _id),
            ).to.be.rejectedWith(`Poll ${_id} not found.`);
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
            expect(getPollStub.calledOnce).to.be.true;
            expect(getPollStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
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
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
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
        it('should return a no object in request body error if nothing is sent', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body = undefined;
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith('No object in request body');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return a no object in request body error if the body is not an object', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body = 'worng';
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith('No object in request body');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return a dto validation failed error if the poll name is not present', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes', 'no'],
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith(
                'An instance of PollCreateDTO has failed the validation',
            );
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return a dto validation failed error if the description is not present', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body = {
                pollName: 'Test',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes', 'no'],
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith(
                'An instance of PollCreateDTO has failed the validation',
            );
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return a dto validation failed error if the deadline is not present', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body = {
                pollName: 'Test',
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes', 'no'],
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith(
                'An instance of PollCreateDTO has failed the validation',
            );
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return a dto validation failed error if isPriority is not present', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body = {
                pollName: 'Test Name',
                description: 'Test description',
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes', 'no'],
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith(
                'An instance of PollCreateDTO has failed the validation',
            );
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return a dto validation failed error if isPrivate is not present', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body = {
                pollName: 'Test Name',
                description: 'Test',
                isProprity: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes', 'no'],
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith(
                'An instance of PollCreateDTO has failed the validation',
            );
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return a dto validation failed error if targetGroup is not present', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body = {
                pollName: 'Test Name',
                description: 'Test',
                isProprity: true,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                pollOptions: ['yes', 'no'],
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith(
                'An instance of PollCreateDTO has failed the validation',
            );
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return a dto validation failed error if targetGroup is not enum', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body = {
                pollName: 'Test Name',
                description: 'Test',
                isProprity: true,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: 'wrong',
                pollOptions: ['yes', 'no'],
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith(
                'An instance of PollCreateDTO has failed the validation',
            );
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return a dto validation failed error if polloptions is not present', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body = {
                pollName: 'Test Name',
                description: 'Test',
                isProprity: true,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith(
                'An instance of PollCreateDTO has failed the validation',
            );
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should return a dto validation failed error if polloptions is not at least length 2', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'IdUser';
            const body = {
                pollName: 'Test Name',
                description: 'Test',
                isProprity: true,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes'],
            };
            await expect(
                PollController.addPoll(userId, body),
            ).to.be.rejectedWith(
                'An instance of PollCreateDTO has failed the validation',
            );
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
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
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
                membership: [EMembership.ALL],
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
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name 1',
            };
            const poll2: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
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
                membership: [EMembership.ALL],
            };
            const poll: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
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
        it("should call the model's get function and return a not found error", async () => {
            const user: IUser = {
                userId: 'ID',
                name: 'name',
                email: 'email',
                membership: [EMembership.ALL],
            };
            const getUserStub = sandbox
                .stub(UserController, 'getUser')
                .resolves(user);
            const getPollStub = sandbox.stub(PollModel, 'get').resolves(null);
            const userId = 'ID';
            const _id = '0123456789AB';
            await expect(
                PollController.getPoll(userId, _id),
            ).to.be.rejectedWith(`Poll ${_id} not found.`);
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
                membership: [EMembership.ALL],
            };
            const poll: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.FULL,
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
            const poll: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name',
            };
            const getPollStub = sandbox.stub(PollModel, 'get').resolves(poll);
            const deleteStub = sandbox.stub(PollModel, 'delete').resolves(true);
            const userId = 'ID';
            const _id = '0123456789AB';
            const ret: boolean = await PollController.deletePoll(userId, _id);
            expect(ret).to.equal(true);
            expect(isAdminStub.calledTwice).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
            expect(getPollStub.calledOnce).to.be.true;
            expect(getPollStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
            expect(deleteStub.calledOnce).to.be.true;
            expect(deleteStub.firstCall.args[0]).to.deep.equal(
                new ObjectId(_id),
            );
        });
        it("should call the model's get function and return a not found error", async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const poll: IPoll = {
                description: 'Test description',
                isPriority: false,
                isPrivate: true,
                pollDeadline: 1000000,
                state: EPollState.OPEN,
                targetGroup: EMembership.ALL,
                pollOptions: ['yes', 'no'],
                pollName: 'Test Name',
            };
            const getPollStub = sandbox.stub(PollModel, 'get').resolves(null);
            const userId = 'ID';
            const _id = '0123456789AB';
            await expect(
                PollController.deletePoll(userId, _id),
            ).to.be.rejectedWith(`Poll ${_id} not found.`);
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
            expect(getPollStub.calledOnce).to.be.true;
            expect(getPollStub.firstCall.args[0]).to.deep.equal(
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
