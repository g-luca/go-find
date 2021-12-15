export default class Account {
    private _address: string;
    private _balance: number;
    private _delegations: number;
    private _rewards: number;
    private _unbonding: number;


    constructor(address: string, balance: number, delegations = 0, rewards = 0, unbonding = 0) {
        this._address = address;
        this._balance = balance;
        this._delegations = delegations;
        this._rewards = rewards;
        this._unbonding = unbonding
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
     * @return {number}
     */
    public get delegations(): number {
        return this._delegations;
    }

    /**
     * Getter rewards
     * @return {number}
     */
    public get rewards(): number {
        return this._rewards;
    }


    /**
     * Getter unbonding
     * @return {number}
     */
    public get unbonding(): number {
        return this._unbonding;
    }



}