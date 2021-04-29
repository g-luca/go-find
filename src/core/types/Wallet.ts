export default class Wallet {
    private _address: string;

    constructor(address: string) {
        this._address = address;
    }



    public get address(): string {
        return this._address;
    }
    public set address(value: string) {
        this._address = value;
    }
}