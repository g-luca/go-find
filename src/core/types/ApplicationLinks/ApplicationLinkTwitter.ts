import { ApplicationLinkState } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkTwitter extends ApplicationLink {
    readonly name: string = 'twitter';
    readonly displayName: string = 'Twitter';
    readonly logo: string = '/public/assets/brands/twitter/logo.svg';
    readonly url: string = "https://www.twitter.com/";
    readonly redirectUrl = `${this.url}${this.username}`;
    readonly usernameRegExp = /^(\w){1,15}$/;
    readonly usernameRegExpError = "Invalid Twitter username. Must not start with @";


    constructor(username: string, state = ApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }

}