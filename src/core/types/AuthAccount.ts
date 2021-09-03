export default class AuthAccount {
    private _dtag: string;
    private _address: string;
    private _isUsingKeplr: boolean;


    constructor(dtag: string, address: string, isUsingKeplr = false) {
        this._dtag = dtag;
        this._address = address;
        this._isUsingKeplr = isUsingKeplr;
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


    /**
     * Getter isUsingKeplr
     * @return {boolean}
     */
    public get isUsingKeplr(): boolean {
        return this._isUsingKeplr;
    }

}