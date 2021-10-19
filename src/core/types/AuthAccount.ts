export default class AuthAccount {
    private _dtag: string;
    private _address: string;
    private _isUsingKeplr: boolean;
    private _isUsingWalletConnect: boolean;


    constructor(dtag: string, address: string, isUsingKeplr = false, isUsingWalletConnect = false) {
        this._dtag = dtag;
        this._address = address;
        this._isUsingKeplr = isUsingKeplr;
        this._isUsingWalletConnect = isUsingWalletConnect;
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


    /**
     * Getter isUsingWalletConnect
     * @return {boolean}
     */
    public get isUsingWalletConnect(): boolean {
        return this._isUsingWalletConnect;
    }

}