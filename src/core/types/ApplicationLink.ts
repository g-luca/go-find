import { ApplicationLinkState } from "@desmoslabs/desmjs-types/desmos/profiles/v1beta1/models_app_links";
export default class ApplicationLink {
    readonly name: string = "";
    readonly displayName: string = "";
    readonly logo: string = "";

    readonly url: string = "";
    readonly usernamePlaceholder: string = "Username";
    readonly redirectUrl: string = "";
    readonly usernameRegExp: RegExp = /.*/;
    readonly usernameRegExpError: string = "Invalid username.";

    username: string;
    state: ApplicationLinkState = ApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED


    constructor(username: string, state: ApplicationLinkState) {
        this.username = username;
        this.state = state;
    }

}