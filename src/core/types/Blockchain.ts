/**
 * Represents a Blockchain info object
 */
export default class Blockchain {
    readonly id: string;
    readonly name: string;
    readonly symbol: string;
    readonly hdpath: string;
    readonly bechPrefix: string;

    constructor($id: string, $name: string, $symbol: string, $hdpath: string, $bechPrefix: string) {
        this.id = $id;
        this.name = $name;
        this.symbol = $symbol;
        this.hdpath = $hdpath;
        this.bechPrefix = $bechPrefix;
    }
}
