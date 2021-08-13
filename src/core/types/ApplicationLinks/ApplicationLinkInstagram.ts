import { DesmosApplicationLinkState } from "desmosjs";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkInstagram extends ApplicationLink {
    readonly name: string = 'instagram';
    readonly displayName: string = 'Instagram';
    readonly logo: string = require('@/assets/brands/instagram/logo.svg');
    readonly url: string = "https://www.instagram.com/";

    constructor(username: string, state = DesmosApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }
}