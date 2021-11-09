import store from '@/store';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useLazyQuery } from '@vue/apollo-composable';
import { ProfileQuery } from '@/gql/ProfileQuery';
import AuthModule from './AuthModule';
import AuthAccount from '@/core/types/AuthAccount';
import router from '@/router';
import DesmosNetworkModule from './DesmosNetworkModule';
const authModule = getModule(AuthModule);
const desmosNetworkModule = getModule(DesmosNetworkModule);

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
            if (process.env.VUE_APP_IS_TESTNET === "true") {
                await KeplrModule.setupDesmosTestnet();
            } else {
                await KeplrModule.setupDesmosMainnet();
            }
            this.address = await (await window.keplr.getKey(desmosNetworkModule.chainId)).bech32Address;

            const getProfileQuery = useLazyQuery(
                ProfileQuery, {
                dtag: "",
                address: this.address
            });
            getProfileQuery.onResult((result) => {
                if (result.loading === false) {
                    if (result.data && result.data.profile[0]) {
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


    private static async setupDesmosMainnet(): Promise<void> {
        if (window.keplr) {
            await window.keplr.experimentalSuggestChain({
                chainId: desmosNetworkModule.chainId,
                chainName: "Desmos",
                rpc: `${process.env.VUE_APP_RPC_ENDPOINT}`,
                rest: `${process.env.VUE_APP_LCD_ENDPOINT}`,
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
            });
        }
    }

    private static async setupDesmosTestnet(): Promise<void> {
        if (window.keplr) {
            await window.keplr.experimentalSuggestChain({
                chainId: desmosNetworkModule.chainId,
                chainName: "Desmos Testnet",
                rpc: `${process.env.VUE_APP_RPC_ENDPOINT}`,
                rest: `${process.env.VUE_APP_LCD_ENDPOINT}`,
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
}