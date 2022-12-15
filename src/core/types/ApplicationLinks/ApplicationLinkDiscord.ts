import { ApplicationLinkState } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkDiscord extends ApplicationLink {
    readonly name: string = 'discord';
    readonly displayName: string = 'Discord';
    readonly logo: string = '/assets/brands/discord/logo.svg';
    readonly url: string = "https://www.discord.com/channels/@me/";
    readonly redirectUrl = `${this.url}${this.username}`;
    readonly usernamePlaceholder: string = "Username#1234";
    readonly usernameRegExp = /^((?!@|#|:|```).{2,32})#\d{4}$/;
    readonly usernameRegExpError = "Invalid Discord username. Copy the full username with the tag";

    constructor(username: string, state = ApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }

}