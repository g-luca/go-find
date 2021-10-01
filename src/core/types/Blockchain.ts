/**
 * Represents a Blockchain info object
 */
export default class Blockchain {
    readonly id: string;
    readonly name: string;
    readonly symbol: string;
    readonly chainId: string;
    readonly hdpath: string;
    readonly bechPrefix: string;

    constructor($id: string, $name: string, $symbol: string, $chainId: string, $hdpath: string, $bechPrefix: string) {
        this.id = $id;
        this.name = $name;
        this.symbol = $symbol;
        this.chainId = $chainId;
        this.hdpath = $hdpath;
        this.bechPrefix = $bechPrefix;
    }
}
