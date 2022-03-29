import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';
import { useAuthStore } from './AuthModule';
import { useWalletStore } from './WalletModule';
import { StdFee } from "@cosmjs/amino";
import { BroadcastMode } from "@cosmjs/launchpad";
import { TxBody } from "cosmjs-types/cosmos/tx/v1beta1/tx"

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
        tx: null as TxBody | null,
        transactionStatus: TransactionStatus.Idle,
        errorMessage: "",
        detailedErrorMessage: "",
        broadcastMode: BroadcastMode.Block,
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
            if (this.transactionStatus !== TransactionStatus.Loading && authStore.account) {
                this.isOpen = true;
                this.transactionStatus = TransactionStatus.Loading;
                if (this.tx) {
                    const broadcastResult = await handleBroadcast(this.tx, this.broadcastMode);
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
                    this.errorMessage = "Ops, something went wrong"
                    this.transactionStatus = TransactionStatus.Error;
                }
            }

        },

        /**
         * Start the transaction process
         * @param tx the transaction that is going to be signed and broadcasted
         */
        start(payload: { tx: TxBody, mode: BroadcastMode }): void {
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
 * Handle the broadcast of a signed tx
 * @param signedTx the signed tx to broadcast
 * @returns true if succeeded, false otherwise
 */
async function handleBroadcast(tx: CosmosTxBody, broadcastMode = BroadcastMode.Block): Promise<{ success: boolean, error: string }> {
    const authStore = useAuthStore();
    const walletStore = useWalletStore();
    try {
        if (authStore.account) {

            const defaultFee: StdFee = {
                amount: [{
                    amount: '8750',
                    denom: import.meta.env.VITE_APP_COIN_FEE_DENOM,
                }],
                gas: authStore.DEFAULT_GAS_LIMIT.toString(),
            }
            // sign the tx
            const client = (await walletStore.wallet.client);
            const broadcastResult = await client.signAndBroadcast(authStore.account.address, tx?.messages, defaultFee, tx?.memo);
            console.log(`tx hash: ${broadcastResult.transactionHash}`);
            if (broadcastResult.transactionHash && broadcastResult.code === 0) {
                return { success: true, error: "" };
            } else {
                return { success: false, error: broadcastResult.rawLog || "" };
            }
        }

    } catch (e) {
        console.log(e)
        return { success: false, error: "Transaction error or aborted" };
    }
    return { success: false, error: "Transaction Error" };
}



// Register the store to enable HMR
registerModuleHMR(useTransactionStore);