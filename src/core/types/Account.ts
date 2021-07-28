export default class Account {
    private _address: string;
    private _balance: number;
    private _delegations: number;


    constructor(address: string, balance: number, delegations = 0) {
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
     * @return {number}
     */
    public get delegations(): number {
        return this._delegations;
    }

}