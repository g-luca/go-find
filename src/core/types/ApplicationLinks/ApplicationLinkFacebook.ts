import { ApplicationLinkState } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkFacebook extends ApplicationLink {
    readonly name: string = 'facebook';
    readonly displayName: string = 'Facebook';
    readonly logo: string = '/public/assets/brands/facebook/logo.svg';
    readonly url: string = "https://www.facebook.com/";

    constructor(username: string, state = ApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(username, state);
    }

}


