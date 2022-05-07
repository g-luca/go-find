export type AccountDelegation = {
    amount: number;
    rewards: number;
    unbonding: number;
    validator_address: string;
}

export type AccountDelegations = {
    totalAmount: number;
    totalRewards: number;
    totalUnbonding: number;
    delegations: AccountDelegation[];
}

export default class Account {
    private _address: string;
    private _balance: number;
    private _delegations: AccountDelegations;


    constructor(address: string, balance: number, delegations: AccountDelegations) {
        this._address = address;
        this._balance = balance;
        this._delegations = delegations;
    }

    /**
     * Getter address
     * @return {string}
     */
    public get address(): string {
        return this._address;
    }

    /**
     * Getter balance
     * @return {number}
     */
    public get balance(): number {
        return this._balance;
    }

    /**
     * Getter delegations
     * @return {AccountDelegations}
     */
    public get delegations(): AccountDelegations {
        return this._delegations;
    }

}