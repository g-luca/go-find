import { DesmosApplicationLinkState } from "desmosjs";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkFacebook extends ApplicationLink {
    readonly name: string = 'facebook';
    readonly displayName: string = 'Facebook';
    readonly logo: string = 'src/assets/brands/facebook/logo.svg';
    readonly url: string = "https://www.facebook.com/";

    constructor(username: string, state = DesmosApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }

}


