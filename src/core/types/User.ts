import PostLink from "./PostLink";
import ApplicationLink from "./ApplicationLink";
import ApplicationLinkFacebook from "./ApplicationLinks/ApplicationLinkFacebook";
import ApplicationLinkGithub from "./ApplicationLinks/ApplicationLinkGithub";
import ApplicationLinkInstagram from "./ApplicationLinks/ApplicationLinkInstagram";
import ApplicationLinkTiktok from "./ApplicationLinks/ApplicationLinkTiktok";
import ApplicationLinkTwitch from "./ApplicationLinks/ApplicationLinkTwitch";
import ApplicationLinkTwitter from "./ApplicationLinks/ApplicationLinkTwitter";
import ApplicationLinkDiscord from "./ApplicationLinks/AppplicationLinkDiscord";

export default class User {
    private _username: string;
    private _nickname: string;
    private _bio: string;
    private _address: string;
    private _profilePic: string;
    private _profileCover: string;

    private _socialIntegrations: ApplicationLink[] = [
        new ApplicationLinkDiscord('l'),
        new ApplicationLinkFacebook('l'),
        new ApplicationLinkTwitch('s'),
        new ApplicationLinkTwitter('f'),
        new ApplicationLinkInstagram('a'),
        new ApplicationLinkTiktok('s'),
        new ApplicationLinkGithub('g-luca'),
    ];
    private _postLinks: PostLink[] = [
        new PostLink(0, 'Link 1', 'addasdad'),
        new PostLink(0, 'Link 2', 'addasdad'),
        new PostLink(0, 'Link 3', 'addasdad'),
    ]


    static USERNAME_REGEX = /[A-Za-z0-9_]{3,30}$/;
    static PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W\_])[a-zA-Z0-9\W\_]{10,30}$/;


    constructor(username: string, address: string, nickname = "", bio = "", profilePic = "", profileCover = "") {
        this._username = username;
        this._address = address;
        this._nickname = nickname;
        this._bio = bio;
        this._profilePic = profilePic;
        this._profileCover = profileCover;
    }

    /**
     * Getter username
     * @return {string}
     */
    public get username(): string {
        return this._username;
    }


    /**
     * Getter address
     * @return {string}
     */
    public get address(): string {
        return this._address;
    }


    /**
     * Getter nickname
     * @return {string}
     */
    public get nickname(): string {
        return this._nickname;
    }

    /**
     * Getter bio
     * @return {string}
     */
    public get bio(): string {
        return this._bio;
    }


    /**
     * Getter applicationLinks
     * @return {ApplicationLink[] }
     */
    public get applicationLinks(): ApplicationLink[] {
        return this._socialIntegrations;
    }


    /**
     * Getter postLinks
     * @return {PostLink[] }
     */
    public get postLinks(): PostLink[] {
        return this._postLinks;
    }


    /**
     * Getter profilePic
     * @return {string}
     */
    public get profilePic(): string {
        return this._profilePic;
    }


    /**
     * Getter profileCover
     * @return {string}
     */
    public get profileCover(): string {
        return this._profileCover;
    }


}