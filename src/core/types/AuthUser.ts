export default class AuthUser {
    private _username: string;
    private _mKey: string;

    constructor(username: string, mkey: string) {
        this._username = username;
        this._mKey = mkey;
    }


    /* Getters / Setters */
    public get username(): string {
        return this._username;
    }
    public get mKey(): string {
        return this._mKey;
    }

}