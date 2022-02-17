import { CosmosBroadcastMode, CosmosTxBody, CosmosTxResponse, Transaction } from 'desmosjs';
import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import { useAuthStore } from './AuthModule';
import { useDesmosNetworkStore } from './DesmosNetworkModule';

export enum TransactionStatus {
    Error = -1,
    Idle = 0,
    Loading = 1,
    Success = 2,
}


export const useTransactionStore = defineStore({
    id: 'TransactionStore',
    state: () => ({
        isOpen: false,
        tx: null as CosmosTxBody | null,
        transactionStatus: TransactionStatus.Idle,
        errorMessage: "",
        detailedErrorMessage: "",
        broadcastMode: CosmosBroadcastMode.BROADCAST_MODE_ASYNC,
    }),
    getters: {
    },
    actions: {

        /**
         * Sign & broadcast the transaction.
         * Note: should be called only after start()
         * @param payload payload containing the TxBody and the mPassword
         */
        async send(payload: { mPassword: string }): Promise<void> {
            const authStore = useAuthStore();
            // check if is not already performing a transaction
            if (this.transactionStatus !== TransactionStatus.Loading) {
                this.isOpen = true;
                this.transactionStatus = TransactionStatus.Loading;
                if (this.tx) {
                    const signedTx = await handleSign(this.tx, payload.mPassword);
                    if (signedTx) {
                        const broadcastResult = await handleBroadcast(signedTx, this.broadcastMode);
                        //const broadcastResult = { success: true, error: "" }; // only for development test
                        if (broadcastResult.success) {
                            setTimeout(() => {
                                this.isOpen = false;
                                this.transactionStatus = TransactionStatus.Success;
                                this.errorMessage = "";
                            }, 500)
                        } else {
                            this.transactionStatus = TransactionStatus.Error;
                            this.errorMessage = "Ops, the chain refused the message, retry."
                            this.detailedErrorMessage = broadcastResult.error;
                        }
                    } else {
                        if (authStore.account?.isUsingKeplr) {
                            this.errorMessage = "Transaction error";
                        } else {
                            this.errorMessage = "Transaction error or wrong password";
                        }
                        this.transactionStatus = TransactionStatus.Error;
                    }
                } else {
                    this.errorMessage = "Ops, something went wrong"
                    this.transactionStatus = TransactionStatus.Error;
                }
            }

        },

        /**
         * Start the transaction process
         * @param tx the transaction that is going to be signed and broadcasted
         */
        start(payload: { tx: CosmosTxBody, mode: CosmosBroadcastMode }): void {
            this.broadcastMode = payload.mode;
            this.tx = payload.tx;
            this.transactionStatus = TransactionStatus.Idle;
            this.errorMessage = "";
            this.detailedErrorMessage = "";
            this.isOpen = true;
        },

        /**
         * Close the modal and reset the TransactionModule state
         */
        closeModal(): void {
            this.tx = null;
            this.transactionStatus = TransactionStatus.Idle;
            this.errorMessage = "";
            this.detailedErrorMessage = "";
            this.isOpen = false;
        }

    },
})


/**
 * Handle the sign process of the tx
 * @param tx Tx Body to sign
 * @param mPassword clear Wallet mPassword
 * @returns the signed tx if succeeded, null otherwise
 */
async function handleSign(tx: CosmosTxBody, mPassword: string): Promise<Transaction | null> {
    const authStore = useAuthStore();
    if (authStore.account) {
        const signedTx = await authStore.signTx(tx, authStore.account.address, mPassword, authStore.account.isUsingKeplr, authStore.account.isUsingWalletConnect);
        if (signedTx) {
            return signedTx;
        }
    }
    return null;
}


/**
 * Handle the broadcast of a signed tx
 * @param signedTx the signed tx to broadcast
 * @returns true if succeeded, false otherwise
 */
async function handleBroadcast(signedTx: Transaction, broadcastMode = CosmosBroadcastMode.BROADCAST_MODE_ASYNC): Promise<{ success: boolean, error: string }> {
    try {
        const broadcastRawResult = await useDesmosNetworkStore().network.broadcast(signedTx, broadcastMode);
        const broadcastResult = CosmosTxResponse.fromJSON(broadcastRawResult.tx_response);
        console.log(`tx hash: ${broadcastResult.txhash}`);
        if (broadcastResult.txhash && broadcastResult.code === 0) {
            return { success: true, error: "" };
        } else {
            return { success: false, error: broadcastRawResult.tx_response?.raw_log || "" };
        }
    } catch (e: any) {
        return { success: false, error: e.message || "" };
    }
}



// Register the store to enable HMR
registerModuleHMR(useTransactionStore);