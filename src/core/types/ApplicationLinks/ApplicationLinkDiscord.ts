import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkDiscord implements ApplicationLink {
    readonly name: string = 'discord';
    readonly displayName: string = 'Discord';
    readonly logo: string = require('@/assets/brands/discord/logo.svg');
    readonly url: string = "https://www.discord.com/channels/@me/";

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