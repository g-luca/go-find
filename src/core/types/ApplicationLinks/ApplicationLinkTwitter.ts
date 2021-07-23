import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkTwitter implements ApplicationLink {
    readonly name: string = 'twitter';
    readonly displayName: string = 'Twitter';
    readonly logo: string = require('@/assets/brands/twitter/logo.svg');
    readonly url: string = "https://www.twitter.com/";

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