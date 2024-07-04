import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type JettonConfig = {};

export function jettonConfigToCell(config: JettonConfig): Cell {
    return beginCell().endCell();
}

export class Jetton implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Jetton(address);
    }

    static createFromConfig(config: JettonConfig, code: Cell, workchain = 0) {
        const data = jettonConfigToCell(config);
        const init = { code, data };
        return new Jetton(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
