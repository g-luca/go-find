import SocialIntegration from "../SociaIntegration";

export default class SocialIntegrationTiktok implements SocialIntegration {
    readonly _name: string = 'tiktok';
    readonly _displayName: string = 'TikTok';
    readonly _logo: string = require('@/assets/brands/tiktok/logo.svg');
    readonly _url: string = "https://www.tiktok.com/";

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