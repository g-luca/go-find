import PostLink from "./PostLink";
import ApplicationLink from "./ApplicationLink";
import ChainLink from "./ChainLink";

export default class User {
    private _username: string;
    private _nickname: string;
    private _bio: string;
    private _address: string;
    private _profilePic: string;
    private _profileCover: string;

    private _applicationLinks: ApplicationLink[] = [];
    private _chainLinks: ChainLink[] = []

    private _postLinks: PostLink[] = [
        new PostLink(0, 'Link 1', 'addasdad'),
        new PostLink(0, 'Link 2', 'addasdad'),
        new PostLink(0, 'Link 3', 'addasdad'),
    ]


    static USERNAME_REGEX = /^[A-Za-z0-9_]{3,30}$/;
    static PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{10,}$/;


    constructor(username: string, address: string, nickname = "", bio = "", profilePic = "", profileCover = "", applicationLinks: ApplicationLink[] = [], chainLinks: ChainLink[] = []) {
        this._username = username;
        this._address = address;
        this._nickname = nickname;
        this._bio = bio;
        this._profilePic = profilePic;
        this._profileCover = profileCover;
        this._applicationLinks = applicationLinks;
        this._chainLinks = chainLinks;
    }


    /**
     * Getter username
     * @return {string}
     */
    public get username(): string {
        return this._username;
    }

    /**
     * Setter username
     * @param {string} value
     */
    public set username(value: string) {
        this._username = value;
    }

    /**
     * Getter nickname
     * @return {string}
     */
    public get nickname(): string {
        return this._nickname;
    }

    /**
     * Setter nickname
     * @param {string} value
     */
    public set nickname(value: string) {
        this._nickname = value;
    }

    /**
     * Getter bio
     * @return {string}
     */
    public get bio(): string {
        return this._bio;
    }

    /**
     * Setter bio
     * @param {string} value
     */
    public set bio(value: string) {
        this._bio = value;
    }

    /**
     * Getter address
     * @return {string}
     */
    public get address(): string {
        return this._address;
    }

    /**
     * Setter address
     * @param {string} value
     */
    public set address(value: string) {
        this._address = value;
    }

    /**
     * Getter profilePic
     * @return {string}
     */
    public get profilePic(): string {
        return this._profilePic;
    }

    /**
     * Setter profilePic
     * @param {string} value
     */
    public set profilePic(value: string) {
        this._profilePic = value;
    }

    /**
     * Getter profileCover
     * @return {string}
     */
    public get profileCover(): string {
        return this._profileCover;
    }

    /**
     * Setter profileCover
     * @param {string} value
     */
    public set profileCover(value: string) {
        this._profileCover = value;
    }

    /**
     * Getter applicationLinks
     * @return {ApplicationLink[] }
     */
    public get applicationLinks(): ApplicationLink[] {
        return this._applicationLinks;
    }

    /**
     * Setter applicationLinks
     * @param {ApplicationLink[] } value
     */
    public set applicationLinks(value: ApplicationLink[]) {
        this._applicationLinks = value;
    }

    /**
     * Getter chainLinks
     * @return {ChainLink[] }
     */
    public get chainLinks(): ChainLink[] {
        return this._chainLinks;
    }

    /**
     * Setter chainLinks
     * @param {ChainLink[] } value
     */
    public set chainLinks(value: ChainLink[]) {
        this._chainLinks = value;
    }

    /**
     * Getter postLinks
     * @return {PostLink[] }
     */
    public get postLinks(): PostLink[] {
        return this._postLinks;
    }

    /**
     * Setter postLinks
     * @param {PostLink[] } value
     */
    public set postLinks(value: PostLink[]) {
        this._postLinks = value;
    }


}