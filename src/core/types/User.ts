import PostLink from "./PostLink";
import SocialIntegration from "./SociaIntegration";
import SocialIntegrationFacebook from "./SocialIntegrations/SocialIntegrationFacebook";
import SocialIntegrationGithub from "./SocialIntegrations/SocialIntegrationGithub";
import SocialIntegrationInstagram from "./SocialIntegrations/SocialIntegrationInstagram";
import SocialIntegrationTiktok from "./SocialIntegrations/SocialIntegrationTiktok";
import SocialIntegrationTwitch from "./SocialIntegrations/SocialIntegrationTwitch";
import SocialIntegrationTwitter from "./SocialIntegrations/SocialIntegrationTwitter";

export default class User {
    private _username: string;
    private _nickname: string;
    private _bio: string;
    private _address: string;
    private _profilePic: string;

    private _socialIntegrations: SocialIntegration[] = [
        new SocialIntegrationFacebook('l'),
        new SocialIntegrationTwitch('s'),
        new SocialIntegrationTwitter('f'),
        new SocialIntegrationInstagram('a'),
        new SocialIntegrationTiktok('s'),
        new SocialIntegrationGithub('g-luca'),
    ];
    private _postLinks: PostLink[] = [
        new PostLink(0, 'Link 1', 'addasdad'),
        new PostLink(0, 'Link 2', 'addasdad'),
        new PostLink(0, 'Link 3', 'addasdad'),
    ]


    static USERNAME_REGEX = /[A-Za-z0-9_]{3,30}$/;
    static PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W\_])[a-zA-Z0-9\W\_]{10,30}$/;


    constructor(username: string, address: string, nickname = "", bio = "", profilePic = "") {
        this._username = username;
        this._address = address;
        this._nickname = nickname;
        this._bio = bio;
        this._profilePic = profilePic;
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
     * Getter socialIntegrations
     * @return {SocialIntegration[] }
     */
    public get socialIntegrations(): SocialIntegration[] {
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



}