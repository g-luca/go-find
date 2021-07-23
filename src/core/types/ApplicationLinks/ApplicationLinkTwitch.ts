import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkTwitch implements ApplicationLink {
    readonly name: string = 'twitch';
    readonly displayName: string = 'Twitch';
    readonly logo: string = require('@/assets/brands/twitch/logo.svg');
    readonly url: string = "https://www.twitch.tv/";

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