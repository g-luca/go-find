export default class ChainLink {
    private _address: string;
    private _chain: string;

    constructor(address: string, chain: string) {
        this._address = address;
        this._chain = chain;
    }

    /**
     * Getter address
     * @return {string}
     */
    public get address(): string {
        return this._address;
    }

    /**
     * Getter chain
     * @return {string}
     */
    public get chain(): string {
        return this._chain;
    }
}