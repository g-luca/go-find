import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkInstagram implements ApplicationLink {
    readonly name: string = 'instagram';
    readonly displayName: string = 'Instagram';
    readonly logo: string = require('@/assets/brands/instagram/logo.svg');
    readonly url: string = "https://www.instagram.com/";

    private _username: string;


    constructor(username: string) {
        this._username = username;
    }

    /**
     * Getter username
     * @return {string}
     */
    public get username(): string {
        return this._username;
    }
}