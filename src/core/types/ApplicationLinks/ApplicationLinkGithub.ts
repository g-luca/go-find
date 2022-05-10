import { ApplicationLinkState } from "@desmoslabs/desmjs-types/desmos/profiles/v2/models_app_links";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkGithub extends ApplicationLink {
    readonly name: string = 'github';
    readonly displayName: string = 'GitHub';
    readonly logo: string = '/public/assets/brands/github/logo.svg';
    readonly url: string = "https://www.github.com/";
    readonly redirectUrl = `${this.url}${this.username}`;

    constructor(username: string, state = ApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }

}