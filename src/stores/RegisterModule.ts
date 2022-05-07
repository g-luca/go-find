import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import { Profile } from '@/core/types/Profile';
import * as bip39 from "bip39";
import CryptoUtils from '@/utils/CryptoUtils';
import Api from '@/core/api/Api';
import AuthAccount from '@/core/types/AuthAccount';
import { Transaction, Wallet } from 'desmosjs';
import { useAuthStore } from './AuthModule';
import { Buffer } from 'buffer';


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


export const useRegisterStore = defineStore({
    id: 'RegisterStore',
    state: () => ({
        dtag: '',
        mPassword: '',
        ePassword: '',
        currentState: RegisterState.StateUserInput,
        mnemonic: [] as string[],
        address: '',
        hasDesmosProfile: false,
    }),
    getters: {
    },
    actions: {
        /**
         * Set Dtag value
         * @param dtag new dtag value
         */
        setDtag(dtag: string): void {
            if (Profile.DTAG_REGEX.test(dtag)) {
                this.dtag = dtag;
            }
        },

        /**
         * Set hasDesmosProfile value
         * @param has new hasDesmosProfile value
         */
        setHasDesmosProfile(has: boolean): void {
            this.hasDesmosProfile = has;
        },


        /**
         * Set mPassword value
         * @param mPassword new mPassword value
         */
        setMPassword(mPassword: string): void {
            if (Profile.PASSWORD_REGEX.test(mPassword)) {
                this.mPassword = mPassword;
            }
        },


        /**
         * Set ePassword value
         * @param ePassword new ePassword value
         */
        setEPassword(ePassword: string): void {
            if (Profile.PASSWORD_REGEX.test(ePassword)) {
                this.ePassword = ePassword;
            }
        },

        /**
         * Generate the wallet from a given mnemonic
         * @param mnemonic user input mnemonic
         * @param isNew generate also a new mnemonic
         */
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
        },


        /**
         * Complete the registration finalizing all the data and sending it to the backend
         */
        async completeRegistration(): Promise<void> {
            const authStore = useAuthStore();
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
                success = await completeNewUserRegistration(this.dtag, eKey, this.address);
            } else {
                // register a new user with already a Desmos Profile
                success = await completeDesmosUserRegistration(this.dtag, eKey, wallet);
            }

            if (success) {
                authStore.saveMKey({ mKey, mPassword }); // store mKey on localStorage
                authStore.saveAuthAccount({ account: new AuthAccount(this.dtag, this.address, false) });
                this.currentState = RegisterState.StateRegistrationSuccess;
            } else {
                this.currentState = RegisterState.StateRegistrationFail;
            }

        },


        /**
         * Change the state to the given one
         * @param newState state to load
         */
        nextState(newState: RegisterState): void {
            this.currentState = newState;
        },


        /**+
         * Reset all the state and goes back to the first RegisterState
         */
        reset(): void {
            this.currentState = RegisterState.StateUserInput;
            this.dtag = "";
            this.mPassword = "";
            this.ePassword = "";
            this.address = "";
            this.mnemonic = [];
        }
    },
})




/**
 * Complete the registration of a user with already a Desmos Profile by calling the rest endpoint
 * @param dtag dtag string
 * @param eKey eKey string
 * @param address user wallet address string
 * @returns true if the operation succeed
 */
async function completeDesmosUserRegistration(dtag: string, eKey: string, wallet: Wallet): Promise<boolean> {
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
async function completeNewUserRegistration(dtag: string, eKey: string, address: string): Promise<boolean> {
    const response = await Api.post(Api.endpoint + 'signup', JSON.stringify({
        dtag,
        eKey,
        address,
    }));
    return response && response.success;
}

// Register the store to enable HMR
registerModuleHMR(useRegisterStore);