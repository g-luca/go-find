export default class PostLink {
    private _id: number;
    private _displayName: string;

    private _url: string;


    constructor(id: number, displayName: string, url: string) {
        this._id = id;
        this._displayName = displayName;
        this._url = url;
    }

    /**
     * Getter id
     * @return {number}
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Getter displayName
     * @return {string}
     */
    public get displayName(): string {
        return this._displayName;
    }

    /**
     * Getter url
     * @return {string}
     */
    public get url(): string {
        return this._url;
    }
}