import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkTiktok implements ApplicationLink {
    readonly name: string = 'tiktok';
    readonly displayName: string = 'TikTok';
    readonly logo: string = require('@/assets/brands/tiktok/logo.svg');
    readonly url: string = "https://www.tiktok.com/";

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