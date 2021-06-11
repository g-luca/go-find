import SocialIntegration from "../SociaIntegration";

export default class SocialIntegrationFacebook implements SocialIntegration {
    readonly _name: string = 'facebook';
    readonly _displayName: string = 'Facebook';
    readonly _logo: string = require('@/assets/brands/facebook/logo.svg');
    readonly _url: string = "https://www.facebook.com/";

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


