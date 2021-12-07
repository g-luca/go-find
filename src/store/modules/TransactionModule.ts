import store from '@/store';
import { CosmosBroadcastMode, CosmosTxBody, CosmosTxResponse, Transaction } from 'desmosjs';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import AuthModule from './AuthModule';
import DesmosNetworkModule from './DesmosNetworkModule';
const authModule = getModule(AuthModule);
const desmosNetworkModule = getModule(DesmosNetworkModule);

export enum TransactionStatus {
    Error = -1,
    Idle = 0,
    Loading = 1,
    Success = 2,
}

@Module({ store, name: 'TransactionModule', dynamic: true })
export default class TransactionModule extends VuexModule {
    public isOpen = false;
    public tx: CosmosTxBody | null = null;
    public transactionStatus: TransactionStatus = TransactionStatus.Idle; // default status
    public errorMessage = "";
    public broadcastMode = CosmosBroadcastMode.BROADCAST_MODE_ASYNC;


    /**
     * Sign & broadcast the transaction.
     * Note: should be called only after start()
     * @param payload payload containing the TxBody and the mPassword
     */
    @Mutation
    public async send(payload: { mPassword: string }): Promise<void> {
        // check if is not already performing a transaction
        if (this.transactionStatus !== TransactionStatus.Loading) {
            this.isOpen = true;
            this.transactionStatus = TransactionStatus.Loading;
            if (this.tx) {
                const signedTx = await TransactionModule.handleSign(this.tx, payload.mPassword);
                if (signedTx) {
                    const broadcastSuccess = await TransactionModule.handleBroadcast(signedTx, this.broadcastMode);
                    //const broadcastSuccess = true; // only for development test
                    if (broadcastSuccess) {
                        this.transactionStatus = TransactionStatus.Success;
                        this.errorMessage = "";
                        setTimeout(() => {
                            this.isOpen = false;
                        }, 500)
                    } else {
                        this.transactionStatus = TransactionStatus.Error;
                        this.errorMessage = "Ops, the chain refused the message, retry later."
                    }
                } else {
                    if (authModule.account?.isUsingKeplr) {
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

    }

    /**
     * Start the transaction process
     * @param tx the transaction that is going to be signed and broadcasted
     */
    @Mutation
    start(payload: { tx: CosmosTxBody, mode: CosmosBroadcastMode }): void {
        this.broadcastMode = payload.mode;
        this.tx = payload.tx;
        this.transactionStatus = TransactionStatus.Idle;
        this.errorMessage = "";
        this.isOpen = true;
    }

    /**
     * Close the modal and reset the TransactionModule state
     */
    @Mutation
    closeModal(): void {
        this.tx = null;
        this.transactionStatus = TransactionStatus.Idle;
        this.errorMessage = "";
        this.isOpen = false;
    }


    /**
     * Handle the sign process of the tx
     * @param tx Tx Body to sign
     * @param mPassword clear Wallet mPassword
     * @returns the signed tx if succeeded, null otherwise
     */
    private static async handleSign(tx: CosmosTxBody, mPassword: string): Promise<Transaction | null> {
        if (authModule.account) {
            const signedTx = await AuthModule.signTx(tx, authModule.account.address, mPassword, authModule.account.isUsingKeplr, authModule.account.isUsingWalletConnect);
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
    private static async handleBroadcast(signedTx: Transaction, broadcastMode = CosmosBroadcastMode.BROADCAST_MODE_ASYNC): Promise<boolean> {
        try {
            console.log(broadcastMode)
            const broadcastRawResult = await desmosNetworkModule.network.broadcast(signedTx, broadcastMode);
            const broadcastResult = CosmosTxResponse.fromJSON(broadcastRawResult.tx_response);
            console.log(`tx hash: ${broadcastResult.txhash}`);
            //TODO: is this check enough?
            if (broadcastResult.txhash && broadcastResult.code === 0) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
}