import Blockchain from "./Blockchain";

export const supportedChainLinks: Blockchain[] = [
    new Blockchain("desmos", "Desmos", "DSM", "m/44'/852'/0'/0/0", "desmos"),
    new Blockchain("cosmos", "Cosmos", "ATOM", "m/44'/118'/0'/0/0", "cosmos"),
    new Blockchain("bitcoin", "Bitcoin", "BTC", "m/44'/0'/0'/0/0", "bc1"),
    new Blockchain("ethereum", "Ethereum", "ETH", "m/44'/60'/0'/0/0", "0x"),
    new Blockchain("dogecoin", "Dogecoin", "DOGE", "m/44'/3'/0'/0/0", "D"),
    new Blockchain("cardano", "Cardano", "ADA", "m/44'/1815'/0'/0/0", "A"),
    new Blockchain("band", "Band Protocol", "BAND", "m/44'/494'/0'/0/0", "band"),
];