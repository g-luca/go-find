import store from '@/store';
import CryptoUtils from '@/utils/CryptoUtils';
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import Account from '@/core/types/Account';

export enum AuthLevel {
    None,
    Account,
    Wallet
}

@Module({ store, name: 'AuthModule', dynamic: true })
export default class AuthModule extends VuexModule {
    private static entropy = 300; // how much mKeys (including the real one) will be generated
    private mPassword: string | null = null;
    private _account: Account | null = null;
    private _authLevel: AuthLevel = AuthLevel.None;


    @Mutation
    public authenticate(): void {
        if (localStorage.getItem('mKey') && localStorage.getItem('account')) {
            this._authLevel = AuthLevel.Account;
            const account = AuthModule.getAccount();
            this._account = account;
            console.log(account);
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

    private static cleanAuthStorage() {
        console.log("cleaning auth")
        localStorage.removeItem("mKey");
        localStorage.removeItem("account");
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
    public saveAccount(payload: { account: Account }): void {
        localStorage.setItem('account', JSON.stringify(payload.account)); // store on localStorage
        this._account = payload.account; // save account on memory
    }


    /**
     * Retrieve the Account from the localStorage
     * @returns Account object
     */
    private static getAccount(): Account | null {
        const accountJSON = localStorage.getItem('account');
        if (accountJSON) {
            try {
                const account: Account = JSON.parse(accountJSON);
                if (account) {
                    return account;
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
    private static getMKey(mPassword: string): string | null {
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
     * @return {Account | null }
     */
    public get account(): Account | null {
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