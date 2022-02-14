import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import { getModule } from "vuex-module-decorators";
import AuthModule from '../store/modules/AuthModule';
import router from '@/router';
import AuthAccount from '@/core/types/AuthAccount';
const authModule = getModule(AuthModule);


export const useWalletConnectStore = defineStore({
    id: 'WalletConnectStore',
    state: () => ({
        hasProfile: false,
        connectedAddress: '',
    }),
    getters: {
    },
    actions: {
        async logout(): Promise<void> {
            await AuthModule.walletConnectClient.killSession();
            authModule.resetWalletConnectClient();
        },
        async init(): Promise<void> {
            authModule.resetWalletConnectClient();
        },

        /**
         * Inizialize WalletConenct connection & listeners
         */
        async connect(): Promise<void> {
            const auth = async () => {
                let address = '';
                if (AuthModule.walletConnectClient.accounts[0]) {
                    // try to retrieve address from session
                    address = AuthModule.walletConnectClient.accounts[0];
                }
                // if the address exists, check if has a Desmos Profile
                if (address) {
                    const result = await (await fetch(`${import.meta.env.VITE_APP_LCD_ENDPOINT}/cosmos/auth/v1beta1/accounts/${address}`)).json();
                    this.connectedAddress = address;
                    if (result.account && result.account.dtag) {
                        const dtag = result.account.dtag;
                        this.hasProfile = true;
                        authModule.saveAuthAccount({ account: new AuthAccount(dtag, address, false, true) });
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
                localStorage.removeItem('walletconnect');
                authModule.resetWalletConnectClient();
                authModule.logout();
                if (error) {
                    throw error;
                }
                router.push('/');
                //reinitialize WalletConnect client
            });

            auth();
        },


        /**
         * Set the choosen dtag for the WalletConnect Account
         */
        async setupProfileWalletConnect(payload: { dtag: string }): Promise<void> {
            authModule.saveAuthAccount({ account: new AuthAccount(payload.dtag, this.connectedAddress, false, true) });
            authModule.authenticate();
            router.push('/me')
        }

    },
})

// Register the store to enable HMR
registerModuleHMR(useWalletConnectStore);