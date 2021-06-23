import store from '@/store'
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import User from '@/core/types/User';
import * as bip39 from "bip39";
import CryptoUtils from '@/utils/CryptoUtils';
import AuthModule from '@/store/modules/AuthModule';
import Api from '@/core/api/Api';
import Account from '@/core/types/Account';
import { Wallet } from 'desmosjs';
const authModule = getModule(AuthModule);


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
    public username = '';
    public mPassword = '';
    public ePassword = '';
    public currentState: RegisterState = RegisterState.StateUserInput;
    public mnemonic: string[] = [];
    public address = '';

    @Mutation
    setUsername(username: string): void {
        if (User.USERNAME_REGEX.test(username)) {
            this.username = username;
        }
    }

    @Mutation
    setMPassword(mPassword: string): void {
        if (User.PASSWORD_REGEX.test(mPassword)) {
            this.mPassword = mPassword;
        }
    }
    @Mutation
    setEPassword(ePassword: string): void {
        if (User.PASSWORD_REGEX.test(ePassword)) {
            this.ePassword = ePassword;
        }
    }

    @Mutation
    generateBip(mnemonic = ""): void {
        bip39.setDefaultWordlist('english')
        if (!mnemonic) {
            mnemonic = bip39.generateMnemonic(256);
        }
        const wallet = new Wallet(mnemonic, '44\'/852\'/0\'/0/0', "desmos", "morpheus-apollo-1");
        this.address = wallet.address;
        this.mnemonic = mnemonic.split(' ');
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
        const response = await Api.post(Api.endpoint + 'signup', JSON.stringify({
            username: this.username,
            eKey,
            address: this.address,
        }));

        if (response && response.success) {
            authModule.saveMKey({ mKey, mPassword }); // store mKey on localStorage
            authModule.saveAccount({ account: new Account(this.username, this.address) });
            this.currentState = RegisterState.StateRegistrationSuccess;
        } else {
            this.currentState = RegisterState.StateRegistrationFail;
        }

    }

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
        this.username = "";
        this.mPassword = "";
        this.ePassword = "";
        this.address = "";
        this.mnemonic = [];
    }
}