import SocialIntegration from "../SociaIntegration";

export default class SocialIntegrationTwitter implements SocialIntegration {
    readonly _name: string = 'twitter';
    readonly _displayName: string = 'Twitter';
    readonly _logo: string = require('@/assets/brands/twitter/logo.svg');
    readonly _url: string = "https://www.twitter.com/";

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