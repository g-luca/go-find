import { TerraSigner } from './../signer/TerraSigner';
import Blockchain from "./Blockchain";
import { ChainLinkConnectionMethod } from './ChainLinkConnectionMethod';

const connectionMethodKeplr = new ChainLinkConnectionMethod("keplr", "Keplr", "keplr");
const connectionMethodLedger = new ChainLinkConnectionMethod("ledger", "Ledger", "ledger");
const connectionMethodTerraStation = new ChainLinkConnectionMethod("terrastation", "Terra Station", "terrastation");
const connectionMethodMetaMask = new ChainLinkConnectionMethod("metamask", "MetaMask", "metamask");
const connectionMethoMnemonic = new ChainLinkConnectionMethod("mnemonic", "mnemonic", "domain");


export const supportedChainLinks: Blockchain[] = [
    new Blockchain("cosmos", "Cosmos", "atom", "cosmoshub-4", "m/44'/118'/0'/0/0", "cosmos", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]), // cosmos must be always the first one
    new Blockchain("terra", "Terra", "LUNA", TerraSigner.chain_id, "m/44'/330'/0'/0/0", "terra", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger, connectionMethodTerraStation]),
    new Blockchain("osmosis", "Osmosis", "osmo", "osmosis-1", "m/44'/118'/0'/0/0", "osmo", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("akash", "Akash", "akt", "akashnet-2", "m/44'/118'/0'/0/0", "akash", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("band", "Band Protocol", "band", "laozi-mainnet", "m/44'/494'/0'/0/0", "band", ['band', 'cosmos'], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("regen", "Regen", "regen", "regen-1", "m/44'/118'/0'/0/0", "regen", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("crypto.org", "Crypto.org", "cro", "crypto-org-chain-mainnet-1", "m/44'/118'/0'/0/0", "cro", ['crypto.org', 'cosmos'], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("sentinel", "Sentinel", "dvpn", "sentinelhub-2", "m/44'/118'/0'/0/0", "sent", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("kava", "Kava", "kava", "kava-3", "m/44'/459'/0'/0/0", "kava", ['kava', 'cosmos'], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("emoney", "e-Money", "ngm", "emoney-3", "m/44'/118'/0'/0/0", "emoney", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("juno", "Juno", "juno", "juno-1", "m/44'/118'/0'/0/0", "juno", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("bitsong", "Bitsong", "btsg", "bitsong-2b", "m/44'/639'/0'/0/0", "bitsong", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("secretnetwork", "Secret Network", "scrt", "secret-3", "m/44'/529'/0'/0/0", "secret", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("sifchain", "Sifchain", "rowan", "sifchain-1", "m/44'/118'/0'/0/0", "sif", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("irisnet", "IRIS", "iris", "irishub-1", "m/44'/118'/0'/0/0", "iaa", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("persistence", "Persistence", "xprt", "core-1", "m/44'/750'/0'/0/0", "persistence", ['persistence', 'cosmos'], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("ixo", "IXO", "ixo", "impacthub-3", "m/44'/118'/0'/0/0", "ixo", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("likecoin", "LikeCoin", "LIKE", "likecoin-mainnet-2", "m/44'/118'/0'/0/0", "like", ["cosmos"], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("desmos", "Desmos", "dsm", "desmos-mainnet", "m/44'/852'/0'/0/0", "desmos", ['desmos', 'cosmos'], [connectionMethodKeplr, connectionMethodLedger]),
    new Blockchain("ethereum", "Ethereum", "eth", "1", "m/44'/60'/0'/0/0", "0x", ["ethereum"], [/* connectionMethodMetaMask */connectionMethoMnemonic]),
];
