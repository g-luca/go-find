import store from '@/store'
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Profile } from '@/core/types/Profile';
import * as bip39 from "bip39";
import CryptoUtils from '@/utils/CryptoUtils';
import AuthModule from '@/store/modules/AuthModule';
import Api from '@/core/api/Api';
import AuthAccount from '@/core/types/AuthAccount';
import { Transaction, Wallet } from 'desmosjs';
const authModule = getModule(AuthModule);


/**
 * Represents the phases of the register process
 */
export enum RegisterState {
    StateUserInput = 'StateUserInput', // user details input
    StateMPasswordInput = 'StateMPasswordInput', // mPassword input
    StateWalletGeneration = 'StateWalletGeneration', // wallet mnemonic generation & confirm
    StateWalletImport = 'StateWalletImport', // wallet mnemonic input & confirm
    StateRegistering = 'StateRegistering', // loading register backend response 
    StateRegistrationSuccess = 'StateRegistrationSuccess', // complete registration success
    StateRegistrationFail = 'StateRegistrationFail', // complete registration error
}


@Module({ store, name: 'RegisterModule', dynamic: true })
export default class RegisterModule extends VuexModule {
    public dtag = '';
    public mPassword = '';
    public ePassword = '';
    public currentState: RegisterState = RegisterState.StateUserInput;
    public mnemonic: string[] = [];
    public address = '';
    public hasDesmosProfile = false;

    @Mutation
    setDtag(dtag: string): void {
        if (Profile.DTAG_REGEX.test(dtag)) {
            this.dtag = dtag;
        }
    }

    @Mutation
    setHasDesmosProfile(has: boolean): void {
        this.hasDesmosProfile = has;
    }

    @Mutation
    setMPassword(mPassword: string): void {
        if (Profile.PASSWORD_REGEX.test(mPassword)) {
            this.mPassword = mPassword;
        }
    }
    @Mutation
    setEPassword(ePassword: string): void {
        if (Profile.PASSWORD_REGEX.test(ePassword)) {
            this.ePassword = ePassword;
        }
    }

    /**
     * Generate the wallet from a given mnemonic
     * @param mnemonic user input mnemonic
     * @param isNew generate also a new mnemonic
     */
    @Mutation
    generateWallet(payload: { mnemonic: string, isNew: boolean }): void {
        let mnemonic = payload.mnemonic
        bip39.setDefaultWordlist('english')
        if (payload.isNew) {
            mnemonic = bip39.generateMnemonic(256);
        }
        if (mnemonic) {
            const wallet = new Wallet(mnemonic);
            this.address = wallet.address;
            this.mnemonic = mnemonic.split(' ');
        }
    }


    /**
     * Complete the registration finalizing all the data and sending it to the backend
     */
    @Mutation
    async completeRegistration(): Promise<void> {
        const wallet = new Wallet(this.mnemonic.join(' ')); // generate the wallet from the given mnemonic
        const privateKeyHex = Buffer.from(wallet.privateKey).toString('hex'); // convert the wallet private key to hex

        const mPassword = CryptoUtils.sha256(this.mPassword); // generate the hashed mPassword
        const mKey = CryptoUtils.encryptAes(mPassword, privateKeyHex); // encrypte private key hex with mPassword

        const ePassword = CryptoUtils.sha256(this.ePassword); // hgenerate the hashed ePassword
        const eKey = CryptoUtils.encryptAes(ePassword, mKey + '#ok'); // encrypt mKey with ePassword


        this.currentState = RegisterState.StateRegistering; // loading state

        let success = false

        if (!this.hasDesmosProfile) {
            // register a completelly new user
            success = await RegisterModule.completeNewUserRegistration(this.dtag, eKey, this.address);
        } else {
            // register a new user with already a Desmos Profile
            success = await RegisterModule.completeDesmosUserRegistration(this.dtag, eKey, wallet);
        }

        if (success) {
            authModule.saveMKey({ mKey, mPassword }); // store mKey on localStorage
            authModule.saveAuthAccount({ account: new AuthAccount(this.dtag, this.address) });
            this.currentState = RegisterState.StateRegistrationSuccess;
        } else {
            this.currentState = RegisterState.StateRegistrationFail;
        }

    }


    /**
     * Change the state to the given one
     * @param newState state to load
     */
    @Mutation
    nextState(newState: RegisterState): void {
        this.currentState = newState;
    }


    /**+
     * Reset all the state and goes back to the first RegisterState
     */
    @Mutation
    reset(): void {
        this.currentState = RegisterState.StateUserInput;
        this.dtag = "";
        this.mPassword = "";
        this.ePassword = "";
        this.address = "";
        this.mnemonic = [];
    }


    /**
     * Complete the registration of a user with already a Desmos Profile by calling the rest endpoint
     * @param dtag dtag string
     * @param eKey eKey string
     * @param address user wallet address string
     * @returns true if the operation succeed
     */
    private static async completeDesmosUserRegistration(dtag: string, eKey: string, wallet: Wallet): Promise<boolean> {
        const hash: Buffer = CryptoUtils.sha256Buffer(Buffer.from(JSON.stringify({
            dtag,
            eKey
        })));
        const signature = (Transaction.signBytes(hash, wallet.privateKey) as Buffer).toString('hex');

        const response = await Api.post(Api.endpoint + 'recover', JSON.stringify({
            dtag,
            eKey,
            signature: signature,
        }));
        return response && response.success;
    }





    /**
     * Complete the registration of a completelly new user by calling the rest endpoint
     * @param dtag dtag string
     * @param eKey eKey string
     * @param address user wallet address string
     * @returns true if the operation succeed
     */
    private static async completeNewUserRegistration(dtag: string, eKey: string, address: string): Promise<boolean> {
        const response = await Api.post(Api.endpoint + 'signup', JSON.stringify({
            dtag,
            eKey,
            address,
        }));
        return response && response.success;
    }
}