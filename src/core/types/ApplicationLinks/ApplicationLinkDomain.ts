import { ApplicationLinkState } from "@desmoslabs/desmjs-types/desmos/profiles/v2/models_app_links";
import ApplicationLink from "../ApplicationLink";

export default class ApplicationLinkDomain extends ApplicationLink {
    readonly name: string = 'domain';
    readonly displayName: string = 'Domain';
    readonly logo: string = 'src/assets/brands/domain/logo.svg';
    readonly url: string = "";
    readonly redirectUrl = `https://${this.username}`;
    readonly usernamePlaceholder: string = "Domain (ex. go-find.me)";


    constructor(domain: string, state = ApplicationLinkState.APPLICATION_LINK_STATE_INITIALIZED_UNSPECIFIED) {
        super(domain, state,);
        if (domain !== "") {
            this.displayName = domain;
            this.logo = `https://${domain}/favicon.ico`;
            this.url = `https://${domain}`;
        }
    }

}