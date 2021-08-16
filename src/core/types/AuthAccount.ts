export default class AuthAccount {
    private _dtag: string;
    private _address: string;


    constructor(dtag: string, address: string) {
        this._dtag = dtag;
        this._address = address;
    }

    /**
     * Getter dtag
     * @return {string}
     */
    public get dtag(): string {
        return this._dtag;
    }

    /**
     * Getter address
     * @return {string}
     */
    public get address(): string {
        return this._address;
    }

}