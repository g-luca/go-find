import { DesmosApplicationLinkState } from "desmosjs";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkGithub extends ApplicationLink {
    readonly name: string = 'github';
    readonly displayName: string = 'GitHub';
    readonly logo: string = require('@/assets/brands/github/logo.svg');
    readonly url: string = "https://www.github.com/";

    constructor(username: string, state = DesmosApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }

}