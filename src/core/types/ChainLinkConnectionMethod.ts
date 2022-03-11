export class ChainLinkConnectionMethod {
    public id: string;
    public name: string;
    public logo: string;
    public chainRestrictions: string[] = [];

    constructor(id: string, name: string, logo: string, chainRestrictions: string[] = []) {
        this.id = id;
        this.name = name;
        this.logo = logo;
        this.chainRestrictions = chainRestrictions;
    }
}



export const supportedChainLinkConnectionMethods = [
    new ChainLinkConnectionMethod("keplr", "Keplr", "keplr"),
    new ChainLinkConnectionMethod("ledger", "Ledger", "ledger"),
    new ChainLinkConnectionMethod("terrastation", "Terra Station", "terrastation", ["terra"])
];