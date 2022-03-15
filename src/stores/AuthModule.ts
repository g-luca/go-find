import { DefaultSigner } from './../core/signer/DefaultSigner';
import { WalletConnectSigner } from './../core/signer/WalletConnectSigner';
import AuthAccount from '@/core/types/AuthAccount';
import CryptoUtils from '@/utils/CryptoUtils';
import { CosmosTxBody, Transaction } from 'desmosjs';
import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import { useAccountStore } from './AccountModule';
import { useWalletStore } from './WalletModule';

export enum AuthLevel {
    None,
    AuthAccount,
    Wallet
}



let mPassword: string | null = null;

const ENTROPY = 300; // how much mKeys (including the real one) will be generated


export const useAuthStore = defineStore({
    id: 'AuthStore',
    state: () => ({
        DEFAULT_GAS_LIMIT: 350000,
        DEFAULT_FEE_AMOUNT: "350",
        granterAddress: '',
        account: null as AuthAccount | null,
        authLevel: AuthLevel.None,
    }),
    getters: {


    },
    actions: {
        /**
         * Account Logout
         */
        logout(): void {
            cleanAuthStorage();
            this.account = null;
            mPassword = null;
            this.authLevel = AuthLevel.None;
            useAccountStore().reset();
            useWalletStore().disconnect(); // disconnect wallet client & signer
        },
        /**
         * Authenticate the user
         */
        authenticate(): void {
            // retrieve the account from localStorage
            if (localStorage.getItem('account')) {
                this.authLevel = AuthLevel.AuthAccount;
                this.account = getAccount();

                // check if there is a mPassword stored in memory for Wallet authentication
                if (mPassword) {
                    const mKey = this.getMKey(mPassword);
                    if (mKey) {
                        this.authLevel = AuthLevel.Wallet;
                    }
                }
            } else {
                cleanAuthStorage();
            }
        },
        /**
         * Set new AuthAccount Dtag
         * @param dtag new user dtag
         */
        setDtag(dtag: string) {
            const accountStore = useAccountStore();
            // ensure that the signer account exists
            if (this.account && accountStore.profile) {
                // update the AuthAccount with the new chosen dtag
                this.account = new AuthAccount(dtag, this.account.address, this.account.isUsingKeplr, this.account.isUsingWalletConnect);
                // update the AuthAccount in the localStorage
                this.saveAuthAccount({ account: this.account as AuthAccount });
                // set as new profile
                accountStore.setIsNewProfile(dtag);
            }
        },
        /**
         * Store securely the account on localStorage.
         * @param account account to store
         */
        saveAuthAccount(payload: { account: AuthAccount }): void {
            localStorage.setItem('account', JSON.stringify(payload.account)); // store on localStorage
            this.account = payload.account; // save account on memory
        },
        /**
         * Store the mKey on localStorage with obfuscation procedure.
         * @param mKey mKey to store
         * @param mPassword mPassword, needed to calculate the position
         */
        saveMKey(payload: { mKey: string, mPassword: string }): void {
            const mKeyPos = getMKeyPosition(payload.mPassword);

            // populate the mKeys array with simil mKey hex strings
            const mKeys = [];
            for (let i = 0; i < ENTROPY; i++) {
                mKeys.push(CryptoUtils.encryptAes(CryptoUtils.sha256(CryptoUtils.randomString(42)), CryptoUtils.randomString(36)));
            }
            mKeys[mKeyPos] = payload.mKey; // set the real one to the given position
            localStorage.setItem('mKey', JSON.stringify(mKeys)); // store on localStorage as JSON

            mPassword = payload.mPassword; // save mPassword on memory
        },
        /**
         * Retrieve the mKey from the localStorage
         * @param mPassword SHA256 hex password
         * @returns mKey string
         */
        getMKey(mPassword: string): string | null {
            const pos = getMKeyPosition(mPassword);
            const mKeyJSON = localStorage.getItem('mKey');
            if (mKeyJSON != null) {
                const mKey = JSON.parse(mKeyJSON)[pos];
                if (mKey) {
                    return mKey;
                }
            }
            return null;
        },
        /**
         * Sign Tx
         * @param tx tx to
         * @param adddress user address
         * @param mPasswordClear clear mPassword (required for default Auth)
         * @param isUsingKeplr is using Keplr
         * @param isUsingWalletConnect is using WalletConnect
         * @returns 
         */
        async signTx(tx: CosmosTxBody, adddress: string, mPasswordClear = "", isUsingKeplr = false, isUsingWalletConnect = false): Promise<Transaction | false> {
            const walletStore = useWalletStore();
            if (mPasswordClear) {
                return await DefaultSigner.signTxWithPassword(tx, adddress, mPasswordClear);
            } else if (isUsingWalletConnect) {
                return await WalletConnectSigner.signWithWalletConenct(tx, adddress);
            }
            return false;
        }
    },

})



/**
 * Retrieve and parse the AuthAccount from the localStorage
 * @returns AuthAccount object
 */
function getAccount(): AuthAccount | null {
    const accountJSON = localStorage.getItem('account');
    if (accountJSON) {
        try {
            const accountRaw = JSON.parse(accountJSON);
            if (accountRaw) {
                return new AuthAccount(accountRaw['_dtag'], accountRaw['_address'], (accountRaw['_isUsingKeplr'] === true), (accountRaw['_isUsingWalletConnect'] === true));
            }
        } catch (e) {
            return null;
        }
    }
    return null;
}



/**
 * Calculate the mKey position inside localStorage from a given password
 * @param mPassword SHA256 hex password
 * @returns localStorage mKey index
 */
function getMKeyPosition(mPassword: string): number {
    // calculate the mKey position inside the mKeys array
    let totalPos = 0;
    for (let i = 0; i < (mPassword.length); i++) {
        totalPos += (parseInt(mPassword[i], 16));
    }
    return totalPos % ENTROPY;
}


/**
 * Cleans Authentication Local Storage
 */
function cleanAuthStorage(): void {
    localStorage.removeItem("mKey");
    localStorage.removeItem("account");
}









// Register the store to enable HMR
registerModuleHMR(useAuthStore);