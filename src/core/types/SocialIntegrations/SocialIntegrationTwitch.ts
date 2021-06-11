import SocialIntegration from "../SociaIntegration";

export default class SocialIntegrationTwitch implements SocialIntegration {
    readonly _name: string = 'twitch';
    readonly _displayName: string = 'Twitch';
    readonly _logo: string = require('@/assets/brands/twitch/logo.svg');
    readonly _url: string = "https://www.twitch.tv/";

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