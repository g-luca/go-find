import { useWalletConnectStore } from '@/stores/WalletConnectModule';
import CryptoUtils from '@/utils/CryptoUtils';
import { useAuthStore } from '@/stores/AuthModule';
import { useDesmosNetworkStore } from "@/stores/DesmosNetworkModule";
import { CosmosAuthInfo, CosmosFee, CosmosPubKey, CosmosSignDoc, CosmosSignerInfo, CosmosSignMode, CosmosTxBody, CosmosTxRaw, Transaction } from 'desmosjs';


export class WalletConnectSigner {

    /**
     * Sign a Tx object with WalletConnect
     * @param txBody 
     * @param address 
     * @returns 
     */
    public static async signWithWalletConenct(txBody: CosmosTxBody, address: string): Promise<Transaction | false> {
        const authStore = useAuthStore();
        const desmosNetworkStore = useDesmosNetworkStore();
        const walletConnectStore = useWalletConnectStore();
        const account = await desmosNetworkStore.network.getAccount(address);
        if (account) {

            const signerInfo: CosmosSignerInfo = {
                /* publicKey: account, */
                modeInfo: { single: { mode: CosmosSignMode.SIGN_MODE_DIRECT } },
                sequence: account.sequence
            };

            const feeValue: CosmosFee = {
                amount: [{ denom: `${import.meta.env.VITE_APP_COIN_FEE_DENOM}`, amount: authStore.DEFAULT_FEE_AMOUNT }],
                gasLimit: authStore.DEFAULT_GAS_LIMIT,
                payer: "",
                granter: authStore.granterAddress
            };

            const authInfo: CosmosAuthInfo = { signerInfos: [signerInfo], fee: feeValue };
            const bodyBytes = CosmosTxBody.encode(txBody).finish();
            const authInfoBytes = CosmosAuthInfo.encode(authInfo).finish();
            const accountNumber = account.accountNumber;
            const params = [{
                signerAddress: account.address,
                signDoc: CryptoUtils.stringifySignDocValues({
                    bodyBytes: bodyBytes,
                    accountNumber: accountNumber,
                    authInfoBytes: authInfoBytes,
                    chainId: desmosNetworkStore.chainId
                } as CosmosSignDoc),
            }];
            try {
                const signedTxRaw = await walletConnectStore.walletConnectClient.sendCustomRequest({
                    jsonrpc: "2.0",
                    method: "cosmos_signDirect",
                    params: params,
                });
                const signedTx = CryptoUtils.parseSignDocValues(signedTxRaw);
                const txRaw = {
                    bodyBytes: signedTx.bodyBytes,
                    authInfoBytes: signedTx.authInfoBytes,
                    signatures: [Buffer.from(signedTx.signature, 'hex')],
                } as CosmosTxRaw;
                return CosmosTxRaw.encode(txRaw).finish();
            } catch (e) {
                // refused by the user
                console.log(e);
                return false;
            }
        }
        return false;
    }



    /**
     * Custom WalletConnect Application Links signing function
     * @param txBody tx to sign
     * @param address signer address
     * @returns {}
     */
    public static async signAppLinkWithWalletConenct(txBody: CosmosTxBody, address: string): Promise<any> {
        const desmosNetworkStore = useDesmosNetworkStore();
        const signerInfo: CosmosSignerInfo = { modeInfo: { single: { mode: CosmosSignMode.SIGN_MODE_DIRECT } }, sequence: 0 };

        const feeValue: CosmosFee = {
            amount: [], gasLimit: 1, payer: "", granter: ""
        };

        const authInfo: CosmosAuthInfo = { signerInfos: [signerInfo], fee: feeValue };
        const bodyBytes = CosmosTxBody.encode(txBody).finish();
        const authInfoBytes = CosmosAuthInfo.encode(authInfo).finish();
        const accountNumber = 0;
        const docValues = {
            bodyBytes: bodyBytes,
            accountNumber: accountNumber,
            authInfoBytes: authInfoBytes,
            chainId: desmosNetworkStore.chainId
        }
        const doc = CryptoUtils.stringifySignDocValues(docValues as CosmosSignDoc);
        const params = [{
            signerAddress: address,
            signDoc: doc,
        }];
        console.log(params)
        try {
            const signedTxRaw = await useWalletConnectStore().walletConnectClient.sendCustomRequest({
                jsonrpc: "2.0",
                method: "cosmos_signDirect",
                params: params,
            });
            console.log(signedTxRaw);
            return { signedTxRaw, doc: doc };
        } catch (e) {
            // refused by the user
            return null;
        }
    }
}