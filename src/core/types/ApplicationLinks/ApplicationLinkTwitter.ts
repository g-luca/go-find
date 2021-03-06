import { DesmosApplicationLinkState } from "desmosjs";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkTwitter extends ApplicationLink {
    readonly name: string = 'twitter';
    readonly displayName: string = 'Twitter';
    readonly logo: string = require('@/assets/brands/twitter/logo.svg');
    readonly url: string = "https://www.twitter.com/";
    readonly redirectUrl = `${this.url}${this.username}`;
    readonly usernameRegExp = /^(\w){1,15}$/;
    readonly usernameRegExpError = "Invalid Twitter username. Must not start with @";


    constructor(username: string, state = DesmosApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }

}