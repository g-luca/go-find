import { useAccountStore } from './AccountModule';
import { useAuthStore } from '@/stores/AuthModule';
import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import { DesmosClient, NoOpSigner, Signer, SignerStatus } from "@desmoslabs/desmjs";
import AuthAccount from '@/core/types/AuthAccount';
import router from '@/router';
import { useKeplrStore } from './KeplrModule';
import { useWalletConnectStore } from './WalletConnectModule';


export enum SupportedSigner {
    WALLETCONNECT = 'walletconnect',
    KEPLR = 'keplr',
    NOOP = 'noop'
}

class Wallet {
    public client = DesmosClient.connectWithSigner(import.meta.env.VITE_APP_RPC_ENDPOINT, new NoOpSigner());
    public signer: Signer = new NoOpSigner();
}

export const useWalletStore = defineStore({
    id: 'WalletStore',
    state: () => ({
        wallet: new Wallet(),
        signerId: SupportedSigner.NOOP,
    }),
    getters: {
    },
    actions: {

        /**
         * Check if there is a wallet connected, and try to reconnect
         */
        async retrievCurrentWallet() {
            const authStore = useAuthStore();
            // if the account is using Keplr, attempt to retrieve the client
            if (authStore.account?.isUsingKeplr) {
                await useKeplrStore().connect();
            }

            // if the account is using WalletConnect, attempt to retrieve the client
            if (authStore.account?.isUsingWalletConnect) {
                await useWalletConnectStore().connect();
            }
        },



        /**
         * Connect to the wallet with the requested signer
         * @param signer Wallet Signer
         */
        async connect(signer: Signer, signerId: SupportedSigner) {
            // update the signer
            this.wallet.signer = signer;
            this.signerId = signerId;

            // connect the signer
            try {
                await this.wallet.signer.connect();
            } catch (e) {
                console.log(e)
            }

            // listen for signer status changes
            this.wallet.signer.addStatusListener((status: SignerStatus) => {
                this.onWalletUpdate();
            })

            this.onWalletUpdate();
        },

        async onWalletUpdate() {

            switch (this.wallet.signer.status) {
                case SignerStatus.Connected:
                    this.onWalletConnected();
                    break;
                case SignerStatus.Connecting:
                    break;
                case SignerStatus.Disconnecting:
                    break;
                case SignerStatus.NotConnected:
                    this.onWalletNotConnected();
                    break;
            }

        },


        /**
         * On Wallet connection success
         * 
         */
        async onWalletConnected() {
            const accountStore = useAccountStore();
            const authStore = useAuthStore();
            accountStore.reset();

            // create the Desmos Client
            try {
                this.wallet.client = DesmosClient.connectWithSigner(import.meta.env.VITE_APP_RPC_ENDPOINT, this.wallet.signer as Signer);
            } catch (e) {
                console.log(e)
                // abort if the client fails to connect
                return;
            }

            // get Wallet account
            const account = (await this.wallet.signer.getAccounts())[0];

            // if the account does not exists, abort
            if (!account) {
                return;
            }

            // get account desmos profile, if exists
            const profile = await (await this.wallet.client).getProfile(account.address);
            // save authentication data
            authStore.saveAuthAccount({ account: new AuthAccount(profile?.dtag || '', account.address, this.signerId === SupportedSigner.KEPLR, this.signerId === SupportedSigner.WALLETCONNECT) });
            authStore.authenticate();


            await accountStore.loadAccount(true);
            router.push('/me');
        },

        async onWalletNotConnected() {
            this.disconnect();
        },


        /**
         * Disconnect from the wallet
         */
        async disconnect() {
            if (this.wallet.signer.isConnected) {
                // disconnect the signer
                await this.wallet.signer.disconnect();

                // disconnect the client
                (await this.wallet.client).disconnect();
            }
        }
    },
})



// Register the store to enable HMR
registerModuleHMR(useWalletStore);