import store from '@/store'
import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import User from '@/core/types/User';
import * as bip39 from "bip39";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cosmos = require('cosmos-lib');
/* import CryptoUtils from "@/utils/crypto" */


export enum RegisterState {
    StateUserInput = 'StateUserInput',
    StateWalletGeneration = 'StateWalletGeneration',
    StateRegistrationSuccess = 'StateRegistrationSuccess',
}


@Module({ store, name: 'RegisterModule', dynamic: true })
export default class RegisterModule extends VuexModule {
    public username = '';
    public password = '';
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
    setPassword(password: string): void {
        if (User.PASSWORD_REGEX.test(password)) {
            this.password = password;
        }
    }

    @Mutation
    generateBip(): void {
        bip39.setDefaultWordlist('english')
        const mnemonic = bip39.generateMnemonic(256);
        const keys = cosmos.crypto.getKeysFromMnemonic(mnemonic, '44\'/852\'/0\'/0/0');
        this.address = cosmos.address.getAddress(keys.publicKey, 'desmos');
        this.mnemonic = mnemonic.split(' ');
        console.log(mnemonic)

    }

    @Mutation
    completeRegistration(): void {
        //TODO: call Cloudflare signup worker
        //TODO: save the encrypted mnemonic on Cloudflare KV [address|mkey]
        //TODO: call faucet
        //TODO: return mkey
        //TODO: redecrypt the mkey with saved password, and store the mnemonic on localStorage/SecureStorage(?)

    }

    @Mutation
    nextState(newState: RegisterState): void {
        this.currentState = newState;
    }
}