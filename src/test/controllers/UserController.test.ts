import { describe } from 'mocha';
import chai, { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

import UserController from '../../controllers/UserController';
import UserModel from '../../models/UserModel';
import { IMembership, IUser } from '../../interface/IUser';

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
            const updateMembershipStub = sandbox
                .stub(UserModel, 'updateMembership')
                .resolves(true);
            const userId1 = 'ID1';
            const userId2 = 'ID2';
            const body: { membership: Array<IMembership> } = {
                membership: ['all'],
            };
            const ret: boolean = await UserController.updateMembership(
                userId1,
                userId2,
                body,
            );
            expect(ret).to.be.true;
            expect(isAdminStub.calledOnce).to.be.true;
            expect(isAdminStub.firstCall.args[0]).to.equal(userId1);
            expect(updateMembershipStub.calledOnce).to.be.true;
            expect(updateMembershipStub.firstCall.args[0]).to.equal(userId2);
            expect(updateMembershipStub.firstCall.args[1]).to.equal(
                body.membership,
            );
        });
        it('should return a bad request error', async () => {
            const isAdminStub = sandbox
                .stub(UserController, 'isAdmin')
                .resolves(true);
            const userId1 = 'ID1';
            const userId2 = 'ID2';
            const body: { membership: Array<IMembership> } = {
                membership: undefined,
            };
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
            const body: { membership: Array<IMembership> } = {
                membership: undefined,
            };
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
                membership: ['all'],
            };
            const ret: boolean = await UserController.addUser(body);
            expect(ret).to.be.true;
            expect(addUserStub.calledOnce).to.be.true;
            expect(addUserStub.firstCall.args[0]).to.deep.equal(newUser);
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
                membership: ['all'],
            };
            const user2: IUser = {
                userId: 'ID2',
                name: 'name2',
                email: 'email2',
                membership: ['all'],
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
            const user: IUser = {
                userId: 'ID',
                name: 'name',
                email: 'email',
                membership: ['all'],
            };
            const getUserStub = sandbox.stub(UserModel, 'get').resolves(user);
            const userId = 'ID';
            const ret: IUser = await UserController.getUser(userId);
            expect(ret).to.deep.equal(user);
            expect(getUserStub.calledOnce).to.be.true;
            expect(getUserStub.firstCall.args[0]).to.equal(userId);
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
                membership: ['all', 'admin'],
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
                membership: ['all'],
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
