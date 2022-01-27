import { DesmosApplicationLinkState } from "desmosjs";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkDiscord extends ApplicationLink {
    readonly name: string = 'discord';
    readonly displayName: string = 'Discord';
    readonly logo: string = require('@/assets/brands/discord/logo.svg');
    readonly url: string = "https://www.discord.com/channels/@me/";
    readonly redirectUrl = `${this.url}${this.username}`;
    readonly usernamePlaceholder: string = "Username#1234";

    constructor(username: string, state = DesmosApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }

}