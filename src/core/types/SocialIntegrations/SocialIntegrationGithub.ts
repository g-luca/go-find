import SocialIntegration from "../SociaIntegration";

export default class SocialIntegrationGithub implements SocialIntegration {
    readonly _name: string = 'github';
    readonly _displayName: string = 'GitHub';
    readonly _logo: string = require('@/assets/brands/github/logo.svg');
    readonly _url: string = "https://www.github.com/";

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