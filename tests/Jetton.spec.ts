import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Jetton } from '../wrappers/Jetton';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Jetton', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Jetton');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let jetton: SandboxContract<Jetton>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        jetton = blockchain.openContract(Jetton.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await jetton.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jetton.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jetton are ready to use
    });
});
