import { DesmosApplicationLinkState } from "desmosjs";

export default class ApplicationLink {
    readonly name: string = "";
    readonly displayName: string = "";
    readonly logo: string = "";

    readonly url: string = "";

    username: string;
    state: DesmosApplicationLinkState = DesmosApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED


    constructor(username: string, state: DesmosApplicationLinkState) {
        this.username = username;
        this.state = state;
    }

}