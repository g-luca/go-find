import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkGithub implements ApplicationLink {
    readonly name: string = 'github';
    readonly displayName: string = 'GitHub';
    readonly logo: string = require('@/assets/brands/github/logo.svg');
    readonly url: string = "https://www.github.com/";

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