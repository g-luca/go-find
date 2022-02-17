import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import router from '@/router';
import AuthAccount from '@/core/types/AuthAccount';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from "@walletconnect/qrcode-modal";
import { useAuthStore } from './AuthModule';


export const useWalletConnectStore = defineStore({
    id: 'WalletConnectStore',
    state: () => ({
        hasProfile: false,
        connectedAddress: '',
        walletConnectClient: new WalletConnect({
            bridge: "https://bridge.walletconnect.org",
        }),
    }),
    getters: {
    },
    actions: {
        async logout(): Promise<void> {
            await this.walletConnectClient.killSession();
            this.resetWalletConnectClient();
        },
        async init(): Promise<void> {
            this.resetWalletConnectClient();
        },

        /**
         * Inizialize WalletConenct connection & listeners
         */
        async connect(): Promise<void> {
            const authStore = useAuthStore();
            const auth = async () => {
                let address = '';
                if (this.walletConnectClient.accounts[0]) {
                    // try to retrieve address from session
                    address = this.walletConnectClient.accounts[0];
                }
                // if the address exists, check if has a Desmos Profile
                if (address) {
                    const result = await (await fetch(`${import.meta.env.VITE_APP_LCD_ENDPOINT}/cosmos/auth/v1beta1/accounts/${address}`)).json();
                    this.connectedAddress = address;
                    if (result.account && result.account.dtag) {
                        const dtag = result.account.dtag;
                        this.hasProfile = true;
                        authStore.saveAuthAccount({ account: new AuthAccount(dtag, address, false, true) });
                        authStore.authenticate();
                        router.push('/me')
                    } else {
                        this.hasProfile = false;
                    }
                }
            }

            // Create a WalletConnect client


            // Check if connection is already established
            if (!this.walletConnectClient.connected) {
                // create new session
                await this.walletConnectClient.createSession();
            }

            // Subscribe to connection events
            this.walletConnectClient.on("connect", (error, payload) => {
                this.connectedAddress = payload.params[0].accounts[0];
                auth();
            });
            this.walletConnectClient.on("session_update", (error, payload) => {
                this.connectedAddress = payload.params[0].accounts[0];
                auth();
            });


            this.walletConnectClient.on("disconnect", (error, payload) => {
                localStorage.removeItem('walletconnect');
                this.resetWalletConnectClient();
                authStore.logout();
                if (error) {
                    throw error;
                }
                router.push('/');
                //reinitialize WalletConnect client
            });

            auth();
        },


        /**
         * Reset WalletConenct connection & listeners
         */
        async resetWalletConnectClient(): Promise<void> {
            this.walletConnectClient = new WalletConnect({
                bridge: "https://bridge.walletconnect.org",
                qrcodeModal: QRCodeModal,
            });
        },


        /**
         * Set the choosen dtag for the WalletConnect Account
         */
        async setupProfileWalletConnect(payload: { dtag: string }): Promise<void> {
            const authStore = useAuthStore();
            authStore.saveAuthAccount({ account: new AuthAccount(payload.dtag, this.connectedAddress, false, true) });
            authStore.authenticate();
            router.push('/me')
        }

    },
})

// Register the store to enable HMR
registerModuleHMR(useWalletConnectStore);