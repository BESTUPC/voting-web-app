import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import sinon, { SinonSandbox } from 'sinon';

chai.use(chaiAsPromised);

let sandbox: SinonSandbox;
describe('VotesController', () => {
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
