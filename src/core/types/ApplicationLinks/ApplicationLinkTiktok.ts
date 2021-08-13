import { DesmosApplicationLinkState } from "desmosjs";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkTiktok extends ApplicationLink {
    readonly name: string = 'tiktok';
    readonly displayName: string = 'TikTok';
    readonly logo: string = require('@/assets/brands/tiktok/logo.svg');
    readonly url: string = "https://www.tiktok.com/";

    constructor(username: string, state = DesmosApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }
}