import Blockchain from "./Blockchain";

export const supportedChainLinks: Blockchain[] = [
    new Blockchain("cosmos", "Cosmos", "atom", "cosmoshub-4", "m/44'/118'/0'/0/0", "cosmos"), // cosmos must be always the first one
    /*  new Blockchain("bitcoin", "Bitcoin", "btc", "", "m/44'/0'/0'/0/0", "bc1"),
     new Blockchain("ethereum", "Ethereum", "eth", "", "m/44'/60'/0'/0/0", "0x"),
     new Blockchain("dogecoin", "Dogecoin", "doge", "", "m/44'/3'/0'/0/0", "D"),
     new Blockchain("cardano", "Cardano", "ada", "", "m/44'/1815'/0'/0/0", "A"), */
    new Blockchain("terra", "Terra", "LUNA", "columbus-5", "m/44'/330'/0'/0/0", "terra"),
    new Blockchain("osmosis", "Osmosis", "osmo", "osmosis-1", "m/44'/118'/0'/0/0", "osmo"),
    new Blockchain("akash", "Akash", "akt", "akashnet-2", "m/44'/118'/0'/0/0", "akash"),
    new Blockchain("band", "Band Protocol", "band", "laozi-mainnet", "m/44'/494'/0'/0/0", "band", ['band', 'cosmos']),
    new Blockchain("regen", "Regen", "regen", "regen-1", "m/44'/118'/0'/0/0", "regen"),
    new Blockchain("crypto.org", "Crypto.org", "cro", "crypto-org-chain-mainnet-1", "m/44'/118'/0'/0/0", "cro", ['crypto.org', 'cosmos']),
    new Blockchain("sentinel", "Sentinel", "dvpn", "sentinelhub-2", "m/44'/118'/0'/0/0", "sent"),
    new Blockchain("kava", "Kava", "kava", "kava-3", "m/44'/459'/0'/0/0", "kava", ['kava', 'cosmos']),
    new Blockchain("emoney", "e-Money", "ngm", "emoney-3", "m/44'/118'/0'/0/0", "emoney"),
    new Blockchain("juno", "Juno", "juno", "juno-1", "m/44'/118'/0'/0/0", "juno"),
    new Blockchain("bitsong", "Bitsong", "btsg", "bitsong-2b", "m/44'/639'/0'/0/0", "bitsong"),
    new Blockchain("secretnetwork", "Secret Network", "scrt", "secret-3", "m/44'/529'/0'/0/0", "secret"),
    new Blockchain("sifchain", "Sifchain", "rowan", "sifchain-1", "m/44'/118'/0'/0/0", "sif"),
    new Blockchain("irisnet", "IRIS", "iris", "irishub-1", "m/44'/118'/0'/0/0", "iaa"),
    new Blockchain("persistence", "Persistence", "xprt", "core-1", "m/44'/750'/0'/0/0", "persistence", ['persistence', 'cosmos']),
    new Blockchain("ixo", "IXO", "ixo", "impacthub-3", "m/44'/118'/0'/0/0", "ixo"),
    new Blockchain("likecoin", "LikeCoin", "LIKE", "likecoin-mainnet-2", "m/44'/118'/0'/0/0", "like"),
    new Blockchain("desmos", "Desmos", "dsm", "desmos-mainnet", "m/44'/852'/0'/0/0", "desmos", ['desmos', 'cosmos']),
];
