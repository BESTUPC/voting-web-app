import { describe } from 'mocha';
import chai, { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

import UserController from '../../controllers/UserController';
import UserModel from '../../models/UserModel';
import { EMembership, IUser } from '../../interfaces/IUser';

let sandbox: SinonSandbox;
describe('UserController', () => {
    describe('test updateMembership', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should call the model's update membership function", async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const user: IUser = {
                userId: 'ID',
                name: 'name',
                email: 'email',
                membership: [EMembership.ALL, EMembership.ADMIN],
            };
            const getUserStub = sandbox.stub(UserModel, 'get').resolves(user);
            const updateMembershipStub = sandbox
                .stub(UserModel, 'updateMembership')
                .resolves(true);
            const userId1 = 'ID1';
            const userId2 = 'ID2';
            const body: Array<EMembership> = [EMembership.ALL];
            const ret: boolean = await UserController.updateMembership(
                userId1,
                userId2,
                body,
            );
            expect(ret).to.be.true;
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
            expect(getUserStub.calledOnce).to.be.true;
            expect(getUserStub.firstCall.args[0]).to.equal(userId2);
            expect(updateMembershipStub.calledOnce).to.be.true;
            expect(updateMembershipStub.firstCall.args[0]).to.equal(userId2);
            expect(updateMembershipStub.firstCall.args[1]).to.equal(body);
        });
        it('should return a bad request error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId1 = 'ID1';
            const userId2 = 'ID2';
            const body = undefined;
            await expect(
                UserController.updateMembership(userId1, userId2, body),
            ).to.be.rejectedWith('Bad request body');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
        });
        it('should return a bad request error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId1 = 'ID1';
            const userId2 = 'ID2';
            const body = ['notMembership'];
            await expect(
                UserController.updateMembership(userId1, userId2, body),
            ).to.be.rejectedWith('Bad request body');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
        });
        it('should return an unauthorized error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            const userId1 = 'ID1';
            const userId2 = 'ID2';
            const body: Array<EMembership> = [EMembership.ALL];
            await expect(
                UserController.updateMembership(userId1, userId2, body),
            ).to.be.rejectedWith('Only admins are authorized');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
        });
    });
    describe('test addUser', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should call the model's add function", async () => {
            const addUserStub = sandbox.stub(UserModel, 'add').resolves(true);
            const body: {
                id: string;
                displayName: string;
                emails: Array<{ value: string; verified: boolean }>;
            } = {
                id: 'ID',
                emails: [{ value: 'email@test.com', verified: true }],
                displayName: 'test',
            };
            const newUser: IUser = {
                userId: body.id,
                email: body.emails[0].value,
                name: body.displayName,
                membership: [EMembership.ALL],
            };
            const ret: boolean = await UserController.addUser(body);
            expect(ret).to.be.true;
            expect(addUserStub.calledOnce).to.be.true;
            expect(addUserStub.firstCall.args[0]).to.deep.equal(newUser);
        });
        it('should return a bad request error', async () => {
            const body: {
                id: string;
                emails: Array<{ value: string; verified: boolean }>;
            } = {
                id: 'ID',
                emails: [{ value: 'email@test.com', verified: true }],
            };
            await expect(UserController.addUser(body)).to.be.rejectedWith(
                'Bad request body',
            );
        });
    });
    describe('test getUsers', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should call the model's get all function", async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId = 'ID';
            const user1: IUser = {
                userId: 'ID1',
                name: 'name1',
                email: 'email1',
                membership: [EMembership.ALL],
            };
            const user2: IUser = {
                userId: 'ID2',
                name: 'name2',
                email: 'email2',
                membership: [EMembership.ALL],
            };
            const getAllStub = sandbox
                .stub(UserModel, 'getAll')
                .resolves([user1, user2]);
            const ret: Array<IUser> = await UserController.getUsers(userId);
            expect(ret).to.deep.equal([user1, user2]);
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
            expect(getAllStub.calledOnce).to.be.true;
        });
        it('should return an unauthorized error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            const userId = 'ID';
            await expect(UserController.getUsers(userId)).to.be.rejectedWith(
                'Only admins are authorized',
            );
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
    });
    describe('test getUser', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should call the model's get function", async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const user: IUser = {
                userId: 'ID2',
                name: 'name',
                email: 'email',
                membership: [EMembership.ALL],
            };
            const getUserStub = sandbox.stub(UserModel, 'get').resolves(user);
            const userId1 = 'ID1';
            const userId2 = 'ID2';
            const ret: IUser = await UserController.getUser(userId1, userId2);
            expect(ret).to.deep.equal(user);
            expect(getUserStub.calledOnce).to.be.true;
            expect(getUserStub.firstCall.args[0]).to.equal(userId2);
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
        });
        it("should call the model's get function", async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            const user: IUser = {
                userId: 'ID',
                name: 'name',
                email: 'email',
                membership: [EMembership.ALL],
            };
            const getUserStub = sandbox.stub(UserModel, 'get').resolves(user);
            const userId = 'ID';
            const ret: IUser = await UserController.getUser(userId, userId);
            expect(ret).to.deep.equal(user);
            expect(getUserStub.calledOnce).to.be.true;
            expect(getUserStub.firstCall.args[0]).to.equal(userId);
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId);
        });
        it('should throw an unauthorized error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(false);
            const userId1 = 'ID1';
            const userId2 = 'ID2';
            await expect(
                UserController.getUser(userId1, userId2),
            ).to.be.rejectedWith('Only admins or same users are authorized');
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
        });
    });
    describe('test isAdmin', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should call the model's get function and return true", async () => {
            const user: IUser = {
                userId: 'ID',
                name: 'name',
                email: 'email',
                membership: [EMembership.ALL, EMembership.ADMIN],
            };
            const getUserStub = sandbox.stub(UserModel, 'get').resolves(user);
            const userId = 'ID';
            const ret: boolean = await UserController.isAdmin(userId);
            expect(ret).to.equal(true);
            expect(getUserStub.calledOnce).to.be.true;
            expect(getUserStub.firstCall.args[0]).to.equal(userId);
        });
        it("should call the model's get function and return false", async () => {
            const user: IUser = {
                userId: 'ID',
                name: 'name',
                email: 'email',
                membership: [EMembership.ALL],
            };
            const getUserStub = sandbox.stub(UserModel, 'get').resolves(user);
            const userId = 'ID';
            const ret: boolean = await UserController.isAdmin(userId);
            expect(ret).to.equal(false);
            expect(getUserStub.calledOnce).to.be.true;
            expect(getUserStub.firstCall.args[0]).to.equal(userId);
        });
    });
});
