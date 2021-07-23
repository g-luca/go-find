import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkFacebook implements ApplicationLink {
    readonly name: string = 'facebook';
    readonly displayName: string = 'Facebook';
    readonly logo: string = require('@/assets/brands/facebook/logo.svg');
    readonly url: string = "https://www.facebook.com/";

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


