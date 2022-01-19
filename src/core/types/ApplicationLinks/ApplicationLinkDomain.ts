import { DesmosApplicationLinkState } from "desmosjs";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkDomain extends ApplicationLink {
    readonly name: string = 'domain';
    readonly displayName: string = 'Domain';
    readonly logo: string = "";
    readonly url: string = "";


    constructor(domain: string, state = DesmosApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(domain, state);
        this.displayName = domain;
        this.logo = `https://${domain}/favicon.ico`;
        this.url = `https://${domain}`;
    }

}