export default class User {
    private _username: string;


    static USERNAME_REGEX = /[A-Za-z0-9_]{3,30}$/;
    static PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W\_])[a-zA-Z0-9\W\_]{10,30}$/;

    constructor(username: string) {
        this._username = username;
    }



    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }
}