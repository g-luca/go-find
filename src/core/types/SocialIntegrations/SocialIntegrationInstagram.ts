import SocialIntegration from "../SociaIntegration";

export default class SocialIntegrationInstagram implements SocialIntegration {
    readonly _name: string = 'instagram';
    readonly _displayName: string = 'Instagram';
    readonly _logo: string = require('@/assets/brands/instagram/logo.svg');
    readonly _url: string = "https://www.instagram.com/";

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