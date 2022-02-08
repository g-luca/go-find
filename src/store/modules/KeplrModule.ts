import { useDesmosNetworkStore } from './../../stores/DesmosNetworkModule';
import store from '@/store';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useLazyQuery } from '@vue/apollo-composable';
import { ProfileQuery } from '@/gql/ProfileQuery';
import AuthModule from './AuthModule';
import AuthAccount from '@/core/types/AuthAccount';
import router from '@/router';
const authModule = getModule(AuthModule);

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Window extends KeplrWindow { }
}


@Module({ store, name: 'KeplrModule', dynamic: true })
export default class KeplrModule extends VuexModule {
    public isInstalled = false;
    public isWaitingAuthentication = false;
    public address = "";
    public hasProfile = false;



    /**
     * Inizialize Keplr global listeners
     */
    @Mutation
    public async init(): Promise<void> {
        if (window.keplr && (authModule.account?.isUsingKeplr || router.currentRoute.value.path === '/login/keplr')) {
            // listen account changes if the user is currently logged with a Keplr account or in the Keplr auth page
            window.addEventListener("keplr_keystorechange", () => {
                authModule.logout();
                router.push('/')
            });

            // suggest fresh new configuration
            if (authModule.account?.isUsingKeplr) {
                if (import.meta.env.VITE_APP_IS_TESTNET === "true") {
                    await KeplrModule.setupDesmosTestnet();
                } else {
                    await KeplrModule.setupDesmosMainnet();
                }
            }

            (window.keplr as any).defaultOptions = {
                sign: {
                    preferNoSetFee: true,
                    preferNoSetMemo: true,
                }
            }
        }
    }


    /**
     * Initialize Keplr Authentication process
     */
    @Mutation
    public async auth(): Promise<void> {
        if (window.keplr) {
            this.isInstalled = true;
            this.isWaitingAuthentication = true;
            if (import.meta.env.VITE_APP_IS_TESTNET === "true") {
                await KeplrModule.setupDesmosTestnet();
            } else {
                await KeplrModule.setupDesmosMainnet();
            }
            const desmosNetworkStore = useDesmosNetworkStore();
            const keplrAccount = await window.keplr.getKey(desmosNetworkStore.chainId)
            if ((await window.keplr.getKey(desmosNetworkStore.chainId) as any).isNanoLedger) {
                alert('Keplr does not support Desmos when used with a Ledger. You can either use your mnemonic, or if you want to use the Ledger use Forbole X instead (https://x.forbole.com/)');
                this.isWaitingAuthentication = false;
                this.hasProfile = false;
                router.push('/')
                return;
            }
            this.address = keplrAccount.bech32Address;

            const getProfileQuery = useLazyQuery(
                ProfileQuery, {
                dtag: "",
                address: this.address
            });
            getProfileQuery.onResult((result) => {
                if (result.loading === false) {
                    if (result.data && result.data.profile[0] && result.data.profile[0].dtag) {
                        const dtag = result.data.profile[0].dtag;
                        this.hasProfile = true;
                        authModule.saveAuthAccount({ account: new AuthAccount(dtag, this.address, true) });
                        authModule.authenticate();
                        router.push('/me')
                    } else {
                        this.hasProfile = false;
                    }
                    this.isWaitingAuthentication = false;
                }
            })
            getProfileQuery.load();
        } else {
            this.isInstalled = false;
        }
    }

    /**
     * Set the choosen dtag for the Keplr Account
     */
    @Mutation
    public async setupProfile(payload: { dtag: string }): Promise<void> {
        authModule.saveAuthAccount({ account: new AuthAccount(payload.dtag, this.address, true) });
        authModule.authenticate();
        router.push('/me')
    }


    public static async setupDesmosMainnet(): Promise<void> {
        if (await window.keplr) {
            await window.keplr!.experimentalSuggestChain({
                chainId: useDesmosNetworkStore().chainId,
                chainName: "Desmos",
                rpc: `${import.meta.env.VITE_APP_RPC_ENDPOINT}`,
                rest: `${import.meta.env.VITE_APP_LCD_ENDPOINT}`,
                bip44: {
                    coinType: 852,
                },
                bech32Config: {
                    bech32PrefixAccAddr: "desmos",
                    bech32PrefixAccPub: "desmos" + "pub",
                    bech32PrefixValAddr: "desmos" + "valoper",
                    bech32PrefixValPub: "desmos" + "valoperpub",
                    bech32PrefixConsAddr: "desmos" + "valcons",
                    bech32PrefixConsPub: "desmos" + "valconspub",
                },
                currencies: [
                    {
                        coinDenom: "DSM",
                        coinMinimalDenom: "udsm",
                        coinDecimals: 6,
                        coinGeckoId: "desmos",
                    },
                ],
                feeCurrencies: [
                    {
                        coinDenom: "udsm",
                        coinMinimalDenom: "udsm",
                        coinDecimals: 6,
                        coinGeckoId: "desmos",
                    },
                ],
                stakeCurrency: {
                    coinDenom: "DSM",
                    coinMinimalDenom: "udsm",
                    coinDecimals: 6,
                    coinGeckoId: "desmos",
                },
                coinType: 852,
                gasPriceStep: {
                    low: 0.002,
                    average: 0.025,
                    high: 0.03,
                },
                features: ['no-legacy-stdTx'],
            });
        }
    }

    private static async setupDesmosTestnet(): Promise<void> {
        if (window.keplr) {
            await window.keplr.experimentalSuggestChain({
                chainId: useDesmosNetworkStore().chainId,
                chainName: "Desmos Testnet",
                rpc: `${import.meta.env.VITE_APP_RPC_ENDPOINT}`,
                rest: `${import.meta.env.VITE_APP_LCD_ENDPOINT}`,
                bip44: {
                    coinType: 852,
                },
                bech32Config: {
                    bech32PrefixAccAddr: "desmos",
                    bech32PrefixAccPub: "desmos" + "pub",
                    bech32PrefixValAddr: "desmos" + "valoper",
                    bech32PrefixValPub: "desmos" + "valoperpub",
                    bech32PrefixConsAddr: "desmos" + "valcons",
                    bech32PrefixConsPub: "desmos" + "valconspub",
                },
                currencies: [
                    {
                        coinDenom: "DARIC",
                        coinMinimalDenom: "udaric",
                        coinDecimals: 6,
                        coinGeckoId: "desmos",
                    },
                ],
                feeCurrencies: [
                    {
                        coinDenom: "udaric",
                        coinMinimalDenom: "udaric",
                        coinDecimals: 6,
                        coinGeckoId: "desmos",
                    },
                ],
                stakeCurrency: {
                    coinDenom: "DARIC",
                    coinMinimalDenom: "udaric",
                    coinDecimals: 6,
                    coinGeckoId: "udaric",
                },
                coinType: 852,
                gasPriceStep: {
                    low: 0.002,
                    average: 0.025,
                    high: 0.03,
                },
            });
        }
    }

    public static async setupTerraMainnet(): Promise<void> {
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
    }

    public static async setupJunoMainnet(): Promise<void> {
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
    }

    public static async setupBandMainnet(): Promise<void> {
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
}