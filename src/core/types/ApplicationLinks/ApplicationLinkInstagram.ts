import { ApplicationLinkState } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkInstagram extends ApplicationLink {
    readonly name: string = 'instagram';
    readonly displayName: string = 'Instagram';
    readonly logo: string = '/public/assets/brands/instagram/logo.svg';
    readonly url: string = "https://www.instagram.com/";

    constructor(username: string, state = ApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }
}