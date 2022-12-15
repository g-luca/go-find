import { ApplicationLinkState } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkTwitch extends ApplicationLink {
    readonly name: string = 'twitch';
    readonly displayName: string = 'Twitch';
    readonly logo: string = '/assets/brands/twitch/logo.svg';
    readonly url: string = "https://www.twitch.tv/";
    readonly redirectUrl = `${this.url}${this.username}`;
    readonly usernameRegExp = /^(\w){4,25}$/;
    readonly usernameRegExpError = "Invalid Twitch username. Must not start with @";


    constructor(username: string, state = ApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }

}