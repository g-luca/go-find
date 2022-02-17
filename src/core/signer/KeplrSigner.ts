import { useAuthStore } from '@/stores/AuthModule';
import { useDesmosNetworkStore } from "@/stores/DesmosNetworkModule";
import { CosmosAuthInfo, CosmosFee, CosmosPubKey, CosmosSignerInfo, CosmosSignMode, CosmosTxBody, CosmosTxRaw, Transaction } from 'desmosjs';
import Long from 'long';


export class KeplrSigner {
    /**
     * Sign a Tx object with Keplr
     * @param tx Transaction body object to sign
     * @param address address of the signer
     * @returns A signed Traansaction object or the string error
     */
    public static async signTxWithKeplr(txBody: CosmosTxBody, address: string): Promise<Transaction | false> {
        const authStore = useAuthStore();
        const desmosNetworkStore = useDesmosNetworkStore();
        let account = null;
        if (!authStore.granterAddress) {
            account = await desmosNetworkStore.network.getAccount(address);
        }
        const pubKey = await window.keplr?.getKey(desmosNetworkStore.chainId);
        if ((account || account === null && authStore.granterAddress) && pubKey) {
            try {

                // avoid keplr custom values
                (window.keplr as any).defaultOptions = {
                    sign: {
                        preferNoSetFee: true,
                        preferNoSetMemo: true,
                    }
                };
                // Get Keplr signer
                const signer = window.keplr?.getOfflineSigner(desmosNetworkStore.chainId);
                const signerInfo: CosmosSignerInfo = {
                    publicKey: {
                        typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                        value: CosmosPubKey.encode({
                            key: pubKey.pubKey,
                        }).finish(),
                    },
                    modeInfo: { single: { mode: CosmosSignMode.SIGN_MODE_DIRECT } },
                    sequence: account?.sequence || 0
                };
                const feeValue: CosmosFee = {
                    amount: [{ denom: `${import.meta.env.VITE_APP_COIN_FEE_DENOM}`, amount: authStore.DEFAULT_FEE_AMOUNT }],
                    gasLimit: authStore.DEFAULT_GAS_LIMIT,
                    payer: '',
                    granter: authStore.granterAddress
                };

                const authInfo: CosmosAuthInfo = { signerInfos: [signerInfo], fee: feeValue };


                const bodyBytes = CosmosTxBody.encode(txBody).finish();
                const authInfoBytes = CosmosAuthInfo.encode(authInfo).finish();
                const accountNumber = account?.accountNumber || 0;
                console.log(accountNumber)
                const signedTx = await signer?.signDirect(address, {
                    accountNumber: Long.fromNumber(accountNumber),
                    authInfoBytes: authInfoBytes,
                    bodyBytes: bodyBytes,
                    chainId: desmosNetworkStore.chainId,
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
                console.log(e);
                //return new Error("Error signing the transaction");
            }
        }
        return false;
    }

}