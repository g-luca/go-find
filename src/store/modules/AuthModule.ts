import store from '@/store';
import CryptoUtils from '@/utils/CryptoUtils';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import AuthAccount from '@/core/types/AuthAccount';
import { CosmosAuthInfo, CosmosFee, CosmosSignerInfo, CosmosSignMode, CosmosTxBody, Network, Transaction } from 'desmosjs';
import AccountModule from './AccountModule';

export enum AuthLevel {
    None,
    AuthAccount,
    Wallet
}

@Module({ store, name: 'AuthModule', dynamic: true })
export default class AuthModule extends VuexModule {
    private static entropy = 300; // how much mKeys (including the real one) will be generated
    private mPassword: string | null = null;
    private _account: AuthAccount | null = null;
    private _authLevel: AuthLevel = AuthLevel.None;


    /**
     * Account Logout
     */
    @Mutation
    public logout(): void {
        AuthModule.cleanAuthStorage();
        this._account = null;
        this.mPassword = null;
        this._authLevel = AuthLevel.None;
        getModule(AccountModule).reset();
    }

    /**
     * Authenticate the user verifying the localStorage keys
     */
    @Mutation
    public authenticate(): void {
        if (localStorage.getItem('mKey') && localStorage.getItem('account')) {
            this._authLevel = AuthLevel.AuthAccount;
            this._account = AuthModule.getAccount();

            // check if there is a mPassword stored in memory for Wallet authentication
            if (this.mPassword) {
                const mKey = AuthModule.getMKey(this.mPassword);
                if (mKey) {
                    this._authLevel = AuthLevel.Wallet;
                }
            }
        } else {
            AuthModule.cleanAuthStorage();
        }
    }

    /**
     * Remove all Authentication localStorage keys
     */
    private static cleanAuthStorage() {
        localStorage.removeItem("mKey");
        localStorage.removeItem("account");
    }

    /**
     * Sign a Tx object
     * @param tx Transaction body object to sign
     * @param address address of the signer
     * @param mPasswordClear wallet mPassword in clear
     * @returns A signed Traansaction object or the string error
     */
    static async signTx(tx: CosmosTxBody, address: string, mPasswordClear: string): Promise<Transaction | false> {
        const mPassword = CryptoUtils.sha256(mPasswordClear);
        const mKey = AuthModule.getMKey(mPassword);
        if (mKey) {
            try {
                const privKey = CryptoUtils.decryptAes(mPassword, mKey);
                const desmosNet = new Network(`${process.env.VUE_APP_LCD_ENDPOINT}`);
                const account = await desmosNet.getAccount(address);
                console.log(account)
                if (account) {
                    try {
                        const signerInfo: CosmosSignerInfo = {
                            /* publicKey: account, */
                            modeInfo: { single: { mode: CosmosSignMode.SIGN_MODE_DIRECT } },
                            sequence: account.sequence
                        };

                        const feeValue: CosmosFee = {
                            amount: [{ denom: "udaric", amount: "200" }],
                            gasLimit: 200000,
                            payer: "",
                            granter: ""
                        };

                        const authInfo: CosmosAuthInfo = { signerInfos: [signerInfo], fee: feeValue };

                        const signedTx = Transaction.signTxBody(tx, authInfo, account.accountNumber, Buffer.from(privKey, 'hex'));
                        return signedTx;
                    } catch (e) {
                        //return new Error("Error signing the transaction");
                    }
                } else {
                    //return new Error("Blockchain connection error");
                }
            } catch (e) {
                //return new Error("Wrong Wallet Password");
            }
        }
        //return new Error("Wrong Wallet Password");
        return false;
    }


    /**
     * Store the mKey on localStorage with obfuscation procedure.
     * @param mKey mKey to store
     * @param mPassword mPassword, needed to calculate the position
     */
    @Mutation
    public saveMKey(payload: { mKey: string, mPassword: string }): void {
        const mKeyPos = AuthModule.getMKeyPosition(payload.mPassword);

        // populate the mKeys array with simil mKey hex strings
        const mKeys = [];
        for (let i = 0; i < AuthModule.entropy; i++) {
            mKeys.push(CryptoUtils.encryptAes(CryptoUtils.sha256(CryptoUtils.randomString(42)), CryptoUtils.randomString(36)));
        }
        mKeys[mKeyPos] = payload.mKey; // set the real one to the given position
        localStorage.setItem('mKey', JSON.stringify(mKeys)); // store on localStorage as JSON

        this.mPassword = payload.mPassword; // save mPassword on memory
    }

    /**
     * Store securely the account on localStorage.
     * @param account account to store
     */
    @Mutation
    public saveAuthAccount(payload: { account: AuthAccount }): void {
        localStorage.setItem('account', JSON.stringify(payload.account)); // store on localStorage
        this._account = payload.account; // save account on memory
    }


    /**
     * Retrieve the AuthAccount from the localStorage
     * @returns AuthAccount object
     */
    private static getAccount(): AuthAccount | null {
        const accountJSON = localStorage.getItem('account');
        if (accountJSON) {
            try {
                const accountRaw = JSON.parse(accountJSON);
                if (accountRaw) {
                    return new AuthAccount(accountRaw['_dtag'], accountRaw['_address']);
                }
            } catch (e) {
                return null;
            }
        }
        return null;
    }


    /**
     * Retrieve the mKey from the localStorage
     * @param mPassword SHA256 hex password
     * @returns mKey string
     */
    public static getMKey(mPassword: string): string | null {
        const pos = this.getMKeyPosition(mPassword);
        const mKeyJSON = localStorage.getItem('mKey');
        if (mKeyJSON != null) {
            const mKey = JSON.parse(mKeyJSON)[pos];
            if (mKey) {
                return mKey;
            }
        }
        return null;
    }


    /**
     * Calculate the mKey position inside localStorage from a given password
     * @param mPassword SHA256 hex password
     * @returns localStorage mKey index
     */
    private static getMKeyPosition(mPassword: string): number {
        // calculate the mKey position inside the mKeys array
        let totalPos = 0;
        for (let i = 0; i < (mPassword.length); i++) {
            totalPos += (parseInt(mPassword[i], 16));
        }
        return totalPos % AuthModule.entropy;
    }




    /**
     * Getter account
     * @return {AuthAccount | null }
     */
    public get account(): AuthAccount | null {
        return this._account;
    }

    /**
     * Getter authLevel
     * @return {AuthLevel }
     */
    public get authLevel(): AuthLevel {
        return this._authLevel;
    }


}