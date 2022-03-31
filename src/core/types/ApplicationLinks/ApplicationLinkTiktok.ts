import { ApplicationLinkState } from "@desmoslabs/desmjs-types/desmos/profiles/v2/models_app_links";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkTiktok extends ApplicationLink {
    readonly name: string = 'tiktok';
    readonly displayName: string = 'TikTok';
    readonly logo: string = 'src/assets/brands/tiktok/logo.svg';
    readonly url: string = "https://www.tiktok.com/";

    constructor(username: string, state = ApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }
}