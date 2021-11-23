import store from '@/store';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import AuthModule from './AuthModule';
import router from '@/router';
import AuthAccount from '@/core/types/AuthAccount';
const authModule = getModule(AuthModule);

@Module({ store, name: 'WalletConnectModule', dynamic: true })
export default class WalletConnectModule extends VuexModule {
    private _hasProfile = false;
    private _connectedAddress = '';



    @Mutation
    public async logout(): Promise<void> {
        await AuthModule.walletConnectClient.killSession();
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
            let address = '';
            if (AuthModule.walletConnectClient.accounts[0]) {
                // try to retrieve address from session
                address = AuthModule.walletConnectClient.accounts[0];
            }
            // if the address exists, check if has a Desmos Profile
            if (address) {
                const result = await (await fetch(`${process.env.VUE_APP_LCD_ENDPOINT}/cosmos/auth/v1beta1/accounts/${address}`)).json();
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
    }


    /**
     * Set the choosen dtag for the WalletConnect Account
     */
    @Mutation
    public async setupProfileWalletConnect(payload: { dtag: string }): Promise<void> {
        authModule.saveAuthAccount({ account: new AuthAccount(payload.dtag, this.connectedAddress, false, true) });
        authModule.authenticate();
        router.push('/me')
    }


    // Getters / Setters

    /**
     * Getter hasProfile
     * @return {boolean}
     */
    public get hasProfile(): boolean {
        return this._hasProfile;
    }

    /**
     * Setter hasProfile
     * @param value 
     */
    public set hasProfile(value: boolean) {
        this._hasProfile = value;
    }


    /**
     * Getter connectedAddress
     * @return {string}
     */
    public get connectedAddress(): string {
        return this._connectedAddress;
    }
    /**
     * Setter connectedAddress
     * @param value address string
     */
    public set connectedAddress(value: string) {
        this._connectedAddress = value;
    }
}