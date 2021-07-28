export default class AuthAccount {
    private _username: string;
    private _address: string;


    constructor(username: string, address: string) {
        this._username = username;
        this._address = address;
    }

    /**
     * Getter username
     * @return {string}
     */
    public get username(): string {
        return this._username;
    }

    /**
     * Getter address
     * @return {string}
     */
    public get address(): string {
        return this._address;
    }

}