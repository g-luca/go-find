import { DESMOS_MAINNET_CHAIN_INFO, DESMOS_TESTNET_CHAIN_INFO } from './../core/signer/KeplrSigner';
import { useAuthStore } from './AuthModule';
import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import { Window as KeplrWindow } from "@keplr-wallet/types";
import router from '@/router';
import { useDesmosNetworkStore } from './DesmosNetworkModule';
import { KeplrSigner } from '@/core/signer/KeplrSigner';
import { SigningMode } from '@desmoslabs/desmjs';
import { SupportedSigner, useWalletStore } from './WalletModule';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Window extends KeplrWindow { }
}


export const useKeplrStore = defineStore({
    id: 'KeplrStore',
    state: () => ({
        isInstalled: false,
        isWaitingAuthentication: false,
        address: "",
        hasProfile: false,
    }),
    getters: {
    },
    actions: {

        /**
         * Initialize Keplr Authentication process
         * Get the Keplr Signer from the window, and connect it to the wallet
         */
        async connect(): Promise<void> {
            if (!window.keplr) {
                return;
            }
            this.isInstalled = true;

            const chainInfo = (useDesmosNetworkStore().isTestnet) ? DESMOS_TESTNET_CHAIN_INFO : DESMOS_MAINNET_CHAIN_INFO;

            // Create the Keplr Signer with the currrent configuration
            const keplrSigner = new KeplrSigner(window.keplr!, {
                signingMode: SigningMode.DIRECT,
                preferNoSetFee: true,
                preferNoSetMemo: true,
                chainInfo: chainInfo,
            });
            const walletStore = useWalletStore();
            await walletStore.connect(keplrSigner, SupportedSigner.KEPLR);

            // If Keplr + Ledger, sign out the user
            const isLedgerKeplrUser = await (await window.keplr.getKey(useDesmosNetworkStore().chainId)).isNanoLedger;
            if (isLedgerKeplrUser) {
                alert('Keplr does not support Desmos when used with a Ledger. You can either use your mnemonic, or if you want to use the Ledger use Forbole X instead (https://x.forbole.com/)')
                useAuthStore().logout();
                router.push('/login')
                return;
            }

        },

        async setupTerraMainnet(): Promise<void> {
            if (await window.keplr) {
                await window.keplr!.experimentalSuggestChain({
                    chainId: 'columbus-5',
                    chainName: "Terra",
                    rpc: 'https://rpc-columbus.keplr.app',
                    rest: 'https://lcd-columbus.keplr.app',
                    bip44: {
                        coinType: 330,
                    },
                    bech32Config: {
                        bech32PrefixAccAddr: "terra",
                        bech32PrefixAccPub: "terra" + "pub",
                        bech32PrefixValAddr: "terra" + "valoper",
                        bech32PrefixValPub: "terra" + "valoperpub",
                        bech32PrefixConsAddr: "terra" + "valcons",
                        bech32PrefixConsPub: "terra" + "valconspub",
                    },
                    currencies: [
                        {
                            coinDenom: 'LUNA',
                            coinMinimalDenom: 'uluna',
                            coinDecimals: 6,
                            coinGeckoId: 'terra-luna',
                        },
                        {
                            coinDenom: 'UST',
                            coinMinimalDenom: 'uusd',
                            coinDecimals: 6,
                            coinGeckoId: 'terrausd',
                        },
                        {
                            coinDenom: 'KRT',
                            coinMinimalDenom: 'ukrw',
                            coinDecimals: 6,
                            coinGeckoId: 'terra-krw',
                        },
                    ],
                    feeCurrencies: [
                        {
                            coinDenom: 'LUNA',
                            coinMinimalDenom: 'uluna',
                            coinDecimals: 6,
                            coinGeckoId: 'terra-luna',
                        },
                        {
                            coinDenom: 'UST',
                            coinMinimalDenom: 'uusd',
                            coinDecimals: 6,
                            coinGeckoId: 'terrausd',
                        },
                    ],
                    gasPriceStep: {
                        low: 0.015,
                        average: 0.015,
                        high: 0.015,
                    },
                    features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
                    stakeCurrency: {
                        coinDenom: 'LUNA',
                        coinMinimalDenom: 'uluna',
                        coinDecimals: 6,
                        coinGeckoId: 'terra-luna',
                    },
                    coinType: 330,
                });
            }
        },

        async setupJunoMainnet(): Promise<void> {
            if (await window.keplr) {
                await window.keplr!.experimentalSuggestChain({
                    chainId: 'juno-1',
                    chainName: "Juno",
                    rpc: 'https://rpc-juno.itastakers.com',
                    rest: 'https://lcd-juno.itastakers.com',
                    bip44: {
                        coinType: 118,
                    },
                    bech32Config: {
                        bech32PrefixAccAddr: "juno",
                        bech32PrefixAccPub: "juno" + "pub",
                        bech32PrefixValAddr: "juno" + "valoper",
                        bech32PrefixValPub: "juno" + "valoperpub",
                        bech32PrefixConsAddr: "juno" + "valcons",
                        bech32PrefixConsPub: "juno" + "valconspub",
                    },
                    currencies: [
                        {
                            coinDenom: 'JUNO',
                            coinMinimalDenom: 'ujuno',
                            coinDecimals: 6,
                            coinGeckoId: 'juno-network',
                        },
                    ],
                    feeCurrencies: [
                        {
                            coinDenom: 'JUNO',
                            coinMinimalDenom: 'ujuno',
                            coinDecimals: 6,
                            coinGeckoId: 'juno-network',
                        },
                    ],
                    stakeCurrency: {
                        coinDenom: 'JUNO',
                        coinMinimalDenom: 'ujuno',
                        coinDecimals: 6,
                        coinGeckoId: 'juno-network',
                    },
                    features: ['stargate', 'ibc-transfer'],
                    coinType: 118,
                });
            }
        },

        async setupBandMainnet(): Promise<void> {
            if (await window.keplr) {
                await window.keplr!.experimentalSuggestChain({
                    chainId: 'laozi-mainnet',
                    chainName: "Band",
                    rpc: 'https://rpc.band.forbole.com/',
                    rest: 'https://lcd.band.forbole.com/',
                    bip44: {
                        coinType: 494,
                    },
                    bech32Config: {
                        bech32PrefixAccAddr: "band",
                        bech32PrefixAccPub: "band" + "pub",
                        bech32PrefixValAddr: "band" + "valoper",
                        bech32PrefixValPub: "band" + "valoperpub",
                        bech32PrefixConsAddr: "band" + "valcons",
                        bech32PrefixConsPub: "band" + "valconspub",
                    },
                    currencies: [
                        {
                            coinDenom: 'BAND',
                            coinMinimalDenom: 'uband',
                            coinDecimals: 6,
                        },
                    ],
                    feeCurrencies: [
                        {
                            coinDenom: 'BAND',
                            coinMinimalDenom: 'uband',
                            coinDecimals: 6,
                        },
                    ],
                    gasPriceStep: {
                        low: 0.015,
                        average: 0.030,
                        high: 0.050,
                    },
                    stakeCurrency: {
                        coinDenom: 'BAND',
                        coinMinimalDenom: 'uband',
                        coinDecimals: 6,
                    },
                    coinType: 494,
                });
            }
        }

    },
})




// Register the store to enable HMR
registerModuleHMR(useKeplrStore);