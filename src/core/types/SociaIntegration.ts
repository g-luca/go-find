export default interface SocialIntegration {
    readonly _name: string;
    readonly _displayName: string;
    readonly _logo: string;

    readonly _url: string;

    username: string;
}