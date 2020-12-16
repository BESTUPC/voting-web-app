import { describe } from 'mocha';
import chai, { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

import UserController from '../../controllers/UserController';
import UserModel from '../../models/UserModel';
import { IMembership } from '../../interface/IUser';

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
});
