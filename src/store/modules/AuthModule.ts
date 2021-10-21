import store from '@/store';
import CryptoUtils from '@/utils/CryptoUtils';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import AuthAccount from '@/core/types/AuthAccount';
import { CosmosAuthInfo, CosmosBroadcastMode, CosmosFee, CosmosPubKey, CosmosSignDoc, CosmosSignerInfo, CosmosSignMode, CosmosTxBody, CosmosTxRaw, DesmosJS, Network, Transaction } from 'desmosjs';
import AccountModule from './AccountModule';
import Long from 'long';
import DesmosNetworkModule from './DesmosNetworkModule';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { SignDoc, TxRaw } from 'desmosjs/dist/types/lib/proto/cosmos/tx/v1beta1/tx';
const desmosNetworkModule = getModule(DesmosNetworkModule);

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
    public static walletConnectClient = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
    });


    @Mutation
    public resetWalletConnectClient(): void {
        AuthModule.walletConnectClient = new WalletConnect({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: QRCodeModal,
        });
        if (!AuthModule.walletConnectClient.connected) {
            localStorage.removeItem('walletconnect');
        }
    }

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
        if (localStorage.getItem('account')) {
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


    static async signTx(tx: CosmosTxBody, adddress: string, mPasswordClear = "", isUsingKeplr = false, isUsingWalletConnect = false): Promise<Transaction | false> {
        if (mPasswordClear) {
            return this.signTxWithPassword(tx, adddress, mPasswordClear);
        } else if (isUsingKeplr) {
            return this.signTxWithKeplr(tx, adddress);
        } else if (isUsingWalletConnect) {
            return this.signWithWalletConenct(tx, adddress);
        }
        return false;
    }


    private static async signWithWalletConenct(txBody: CosmosTxBody, address: string): Promise<Transaction | false> {
        const account = await desmosNetworkModule.network.getAccount(address);
        if (account) {

            const signerInfo: CosmosSignerInfo = {
                /* publicKey: account, */
                modeInfo: { single: { mode: CosmosSignMode.SIGN_MODE_DIRECT } },
                sequence: account.sequence
            };

            const feeValue: CosmosFee = {
                amount: [{ denom: `${process.env.VUE_APP_COIN_FEE_DENOM}`, amount: "200" }],
                gasLimit: 200000,
                payer: "",
                granter: ""
            };

            const authInfo: CosmosAuthInfo = { signerInfos: [signerInfo], fee: feeValue };
            const bodyBytes = CosmosTxBody.encode(txBody).finish();
            const authInfoBytes = CosmosAuthInfo.encode(authInfo).finish();
            const accountNumber = account.accountNumber;
            const params = [{
                signerAddress: account.address,
                signDoc: this.stringifySignDocValues({
                    bodyBytes: bodyBytes,
                    accountNumber: accountNumber,
                    authInfoBytes: authInfoBytes,
                    chainId: desmosNetworkModule.chainId
                } as SignDoc),
            }];
            try {
                const signedTxRaw = await AuthModule.walletConnectClient.sendCustomRequest({
                    jsonrpc: "2.0",
                    method: "cosmos_signDirect",
                    params: params,
                });
                const signedTx = this.parseSignDocValues(signedTxRaw);
                const txRaw = {
                    bodyBytes: signedTx.bodyBytes,
                    authInfoBytes: signedTx.authInfoBytes,
                    signatures: [Buffer.from(signedTx.signature, 'hex')],
                } as TxRaw;
                return CosmosTxRaw.encode(txRaw).finish();
            } catch (e) {
                // refused by the user
                console.log(e);
                return false;
            }
        }
        return false;
    }


    private static parseSignDocValues(signDoc: any) {
        return {
            ...signDoc,
            bodyBytes: this.fromHex(signDoc.bodyBytes),
            authInfoBytes: this.fromHex(signDoc.authInfoBytes),
            accountNumber: Long.fromNumber(parseInt(signDoc.accountNumber, 16)),
        };
    }


    private static fromHex(hexstring: string): Uint8Array {
        if (hexstring.length % 2 !== 0) {
            throw new Error("hex string length must be a multiple of 2");
        }

        const listOfInts: number[] = [];
        for (let i = 0; i < hexstring.length; i += 2) {
            const hexByteAsString = hexstring.substr(i, 2);
            if (!hexByteAsString.match(/[0-9a-f]{2}/i)) {
                throw new Error("hex string contains invalid characters");
            }
            listOfInts.push(parseInt(hexByteAsString, 16));
        }
        return new Uint8Array(listOfInts);
    }
    private static stringifySignDocValues(signDoc: any) {
        return {
            ...signDoc,
            bodyBytes: this.toHex(signDoc.bodyBytes),
            authInfoBytes: this.toHex(signDoc.authInfoBytes),
            accountNumber: signDoc.accountNumber.toString(16),
        };
    }
    private static toHex(data: Uint8Array): string {
        let out = "";
        for (const byte of data) {
            out += ("0" + byte.toString(16)).slice(-2);
        }
        return out;
    }

    /**
     * Sign a Tx object with Keplr
     * @param tx Transaction body object to sign
     * @param address address of the signer
     * @returns A signed Traansaction object or the string error
     */
    private static async signTxWithKeplr(txBody: CosmosTxBody, address: string): Promise<Transaction | false> {
        const account = await desmosNetworkModule.network.getAccount(address);
        const pubKey = await window.keplr?.getKey(desmosNetworkModule.chainId);
        if (account && pubKey) {
            try {

                // Get Keplr signer
                const signer = window.keplr?.getOfflineSigner(desmosNetworkModule.chainId);


                const signerInfo: CosmosSignerInfo = {
                    publicKey: {
                        typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                        value: CosmosPubKey.encode({
                            key: pubKey.pubKey,
                        }).finish(),
                    },
                    modeInfo: { single: { mode: CosmosSignMode.SIGN_MODE_DIRECT } },
                    sequence: account.sequence
                };

                const feeValue: CosmosFee = {
                    amount: [{ denom: `${process.env.VUE_APP_COIN_FEE_DENOM}`, amount: "200" }],
                    gasLimit: 200000,
                    payer: "",
                    granter: "",
                };

                const authInfo: CosmosAuthInfo = { signerInfos: [signerInfo], fee: feeValue };



                const bodyBytes = CosmosTxBody.encode(txBody).finish();
                const authInfoBytes = CosmosAuthInfo.encode(authInfo).finish();

                const signedTx = await signer?.signDirect(address, {
                    accountNumber: Long.fromNumber(account.accountNumber),
                    authInfoBytes: authInfoBytes,
                    bodyBytes: bodyBytes,
                    chainId: desmosNetworkModule.chainId,
                });



                if (signedTx) {
                    const broadcastTx: CosmosTxRaw = {
                        bodyBytes: signedTx.signed.bodyBytes,
                        authInfoBytes: signedTx.signed.authInfoBytes,
                        signatures: [Buffer.from(signedTx.signature.signature, 'base64')],
                    };
                    const broadcastBytes = CosmosTxRaw.encode(broadcastTx).finish();
                    return broadcastBytes;
                }

                return false;
            } catch (e) {
                //return new Error("Error signing the transaction");
            }
        }
        return false;
    }


    /**
     * Sign a Tx object
     * @param tx Transaction body object to sign
     * @param address address of the signer
     * @param mPasswordClear wallet mPassword in clear
     * @returns A signed Traansaction object or the string error
     */
    private static async signTxWithPassword(tx: CosmosTxBody, address: string, mPasswordClear: string): Promise<Transaction | false> {
        const mPassword = CryptoUtils.sha256(mPasswordClear);
        const mKey = AuthModule.getMKey(mPassword);
        if (mKey) {
            try {
                const privKey = CryptoUtils.decryptAes(mPassword, mKey);
                const account = await desmosNetworkModule.network.getAccount(address);
                console.log(account)
                if (account) {
                    try {
                        const signerInfo: CosmosSignerInfo = {
                            /* publicKey: account, */
                            modeInfo: { single: { mode: CosmosSignMode.SIGN_MODE_DIRECT } },
                            sequence: account.sequence
                        };

                        const feeValue: CosmosFee = {
                            amount: [{ denom: `${process.env.VUE_APP_COIN_FEE_DENOM}`, amount: "200" }],
                            gasLimit: 200000,
                            payer: "",
                            granter: ""
                        };

                        const authInfo: CosmosAuthInfo = { signerInfos: [signerInfo], fee: feeValue };

                        const signedTx = Transaction.signTxBody(tx, authInfo, account.accountNumber, Buffer.from(privKey, 'hex'));
                        console.log(signedTx)
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
                    return new AuthAccount(accountRaw['_dtag'], accountRaw['_address'], (accountRaw['_isUsingKeplr'] === true), (accountRaw['_isUsingWalletConnect'] === true));
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