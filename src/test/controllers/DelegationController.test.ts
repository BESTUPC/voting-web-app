import { describe } from 'mocha';
import chai, { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

let sandbox: SinonSandbox;
describe('DelegationController', () => {
    describe('test updateMembership', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            sandbox.restore();
        });

        xit('should ot be executed', async () => {
            console.log('NOTHING');
        });
    });
});
