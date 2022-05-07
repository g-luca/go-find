import CryptoUtils from '@/utils/CryptoUtils';
import { useAuthStore } from '@/stores/AuthModule';
import { useDesmosNetworkStore } from "@/stores/DesmosNetworkModule";
import { CosmosAuthInfo, CosmosFee, CosmosPubKey, CosmosSignDoc, CosmosSignerInfo, CosmosSignMode, CosmosTxBody, CosmosTxRaw, Transaction, Wallet } from 'desmosjs';
import { Buffer } from 'buffer';


export class DefaultSigner {
    /**
     * Sign a Tx object
     * @param tx Transaction body object to sign
     * @param address address of the signer
     * @param mPasswordClear wallet mPassword in clear
     * @returns A signed Traansaction object or the string error
     */
    public static async signTxWithPassword(tx: CosmosTxBody, address: string, mPasswordClear: string): Promise<Transaction | false> {
        const authStore = useAuthStore();
        const desmosNetworkStore = useDesmosNetworkStore();
        const mPassword = CryptoUtils.sha256(mPasswordClear);
        const mKey = authStore.getMKey(mPassword);
        if (mKey) {
            try {
                const privKey = CryptoUtils.decryptAes(mPassword, mKey);

                let account = null;
                if (!authStore.granterAddress) {
                    account = await desmosNetworkStore.network.getAccount(address);
                }
                console.log(account)
                if (account || (account === null && authStore.granterAddress)) {
                    try {
                        let pubKey = undefined;
                        try {
                            pubKey = {
                                typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                                value: CosmosPubKey.encode({
                                    key: Wallet.calculatePubKey(Buffer.from(privKey, 'hex'))!,
                                }).finish(),
                            };
                        } catch (e) {
                            // ignore
                        }
                        const signerInfo: CosmosSignerInfo = {
                            publicKey: pubKey,
                            modeInfo: { single: { mode: CosmosSignMode.SIGN_MODE_DIRECT } },
                            sequence: account?.sequence || 0,
                        };

                        const feeValue: CosmosFee = {
                            amount: [{ denom: `${import.meta.env.VITE_APP_COIN_FEE_DENOM}`, amount: authStore.DEFAULT_FEE_AMOUNT }],
                            gasLimit: authStore.DEFAULT_GAS_LIMIT,
                            payer: "",
                            granter: authStore.granterAddress
                        };

                        const authInfo: CosmosAuthInfo = { signerInfos: [signerInfo], fee: feeValue };

                        const signedTx = Transaction.signTxBody(tx, authInfo, account?.accountNumber || 0, Buffer.from(privKey, 'hex'));
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
}