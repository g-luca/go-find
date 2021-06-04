import store from '@/store'
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import User from '@/core/types/User';
import * as bip39 from "bip39";
import CryptoUtils from '@/utils/CryptoUtils';
import AuthModule from '@/store/modules/AuthModule';
import Api from '@/core/api/Api';
import Account from '@/core/types/Account';
const authModule = getModule(AuthModule);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DesmosJS = require("desmosjs/dist/lib/DesmosJS.js");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cosmos = require('cosmos-lib');

export enum RegisterState {
    StateUserInput = 'StateUserInput',
    StateMPasswordInput = 'StateMPasswordInput',
    StateWalletGeneration = 'StateWalletGeneration',
    StateWalletImport = 'StateWalletImport',
    StateRegistrationSuccess = 'StateRegistrationSuccess',
    StateRegistrationFail = 'StateRegistrationFail',
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
        const keys = cosmos.crypto.getKeysFromMnemonic(mnemonic, '44\'/852\'/0\'/0/0');
        this.address = cosmos.address.getAddress(keys.publicKey, 'desmos');
        this.mnemonic = mnemonic.split(' ');
    }

    @Mutation
    async completeRegistration(): Promise<void> {
        const wallet = new DesmosJS.Wallet(this.mnemonic.join(' ')); // generate the wallet from the given mnemonic
        const privateKeyHex = Buffer.from(wallet.privateKey).toString('hex'); // convert the wallet private key to hex

        const mPassword = CryptoUtils.sha256(this.mPassword); // generate the hashed mPassword
        const mKey = CryptoUtils.encryptAes(mPassword, privateKeyHex); // encrypte private key hex with mPassword

        const ePassword = CryptoUtils.sha256(this.ePassword); // hgenerate the hashed ePassword
        const eKey = CryptoUtils.encryptAes(ePassword, mKey + '#ok'); // encrypt mKey with ePassword

        //TODO: implement response logic
        const response = await Api.post('signup', JSON.stringify({
            username: this.username,
            eKey,
            address: this.address,
        }));

        if (response && response.success) {
            authModule.saveMKey({ mKey, mPassword }); // store mKey on localStorage
            authModule.saveAccount({ account: new Account(this.username, this.address) });
        } else {
            this.currentState = RegisterState.StateRegistrationFail;
        }

    }

    @Mutation
    nextState(newState: RegisterState): void {
        this.currentState = newState;
    }
}