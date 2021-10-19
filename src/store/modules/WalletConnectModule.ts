import store from '@/store';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import AuthModule from './AuthModule';
import router from '@/router';
import AuthAccount from '@/core/types/AuthAccount';
import { useLazyQuery } from '@vue/apollo-composable';
import { ProfileQuery } from '@/gql/ProfileQuery';
const authModule = getModule(AuthModule);

@Module({ store, name: 'WalletConnectModule', dynamic: true })
export default class WalletConnectModule extends VuexModule {
    public hasProfile = false;
    private connectedAddress = '';


    @Mutation
    public async logout(): Promise<void> {
        authModule.resetWalletConnectClient();
    }

    @Mutation
    public async init(): Promise<void> {
        authModule.resetWalletConnectClient();
    }

    /**
     * Inizialize WalletConenct connection & listeners
     */
    @Mutation
    public async connect(): Promise<void> {
        const auth = async () => {
            if (AuthModule.walletConnectClient.accounts[0]) {
                // try to retrieve address from session
                this.connectedAddress = AuthModule.walletConnectClient.accounts[0];
            }
            // if the address exists, check if has a Desmos Profile
            if (this.connectedAddress) {
                const result = await (await fetch(`${process.env.VUE_APP_LCD_ENDPOINT}cosmos/auth/v1beta1/accounts/${this.connectedAddress}`)).json();
                if (result.account && result.account.dtag) {
                    const dtag = result.account.dtag;
                    this.hasProfile = true;
                    authModule.saveAuthAccount({ account: new AuthAccount(dtag, this.connectedAddress, false, true) });
                    authModule.authenticate();
                    router.push('/me')
                } else {
                    this.hasProfile = false;
                }
            }
        }

        // Create a WalletConnect client


        // Check if connection is already established
        if (!AuthModule.walletConnectClient.connected) {
            // create new session
            await AuthModule.walletConnectClient.createSession();
        }

        // Subscribe to connection events
        AuthModule.walletConnectClient.on("connect", (error, payload) => {
            this.connectedAddress = payload.params[0].accounts[0];
            auth();
        });
        AuthModule.walletConnectClient.on("session_update", (error, payload) => {
            this.connectedAddress = payload.params[0].accounts[0];
            auth();
        });


        AuthModule.walletConnectClient.on("disconnect", (error, payload) => {
            authModule.logout();
            authModule.resetWalletConnectClient();
            router.push('/');
            if (error) {
                throw error;
            }
            //reinitialize WalletConnect client
        });

        auth();
    }


    /**
     * Set the choosen dtag for the WalletConnect Account
     */
    @Mutation
    public async setupProfile(payload: { dtag: string }): Promise<void> {
        authModule.saveAuthAccount({ account: new AuthAccount(payload.dtag, this.connectedAddress, false, true) });
        authModule.authenticate();
        router.push('/me')
    }
}