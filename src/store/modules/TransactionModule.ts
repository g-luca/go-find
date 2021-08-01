import store from '@/store';
import { CosmosTypes, Network, Transaction } from 'desmosjs';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import AuthModule from './AuthModule';
const authModule = getModule(AuthModule);

export enum TransactionStatus {
    Error = -1,
    Idle = 0,
    Loading = 1,
    Success = 2,
}

@Module({ store, name: 'TransactionModule', dynamic: true })
export default class TransactionModule extends VuexModule {
    public isOpen = false;
    public tx: CosmosTypes.TxBody | null = null;
    public transactionStatus: TransactionStatus = TransactionStatus.Idle; // default status
    public errorMessage = "";


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
                    const broadcastSuccess = await TransactionModule.handleBroadcast(signedTx);
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
                    this.errorMessage = "Wrong password"
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
    start(tx: CosmosTypes.TxBody): void {
        this.tx = tx;
        this.isOpen = true;
        this.transactionStatus = TransactionStatus.Idle;
        this.errorMessage = "";
    }

    /**
     * Close the modal and reset the TransactionModule state
     */
    @Mutation
    closeModal(): void {
        this.isOpen = !this.isOpen;
        this.tx = null;
        this.transactionStatus = TransactionStatus.Idle;
        this.errorMessage = "";
    }


    /**
     * Handle the sign process of the tx
     * @param tx Tx Body to sign
     * @param mPassword clear Wallet mPassword
     * @returns the signed tx if succeeded, null otherwise
     */
    private static async handleSign(tx: CosmosTypes.TxBody, mPassword: string): Promise<Transaction | null> {
        if (authModule.account) {
            const signedTx = await AuthModule.signTx(tx, authModule.account.address, mPassword);
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
    private static async handleBroadcast(signedTx: Transaction): Promise<boolean> {
        try {
            const desmosNet = new Network('https://lcd.go-find.me');
            const broadcastRawResult = await desmosNet.broadcast(signedTx, CosmosTypes.BroadcastMode.BROADCAST_MODE_SYNC);
            const broadcastResult = CosmosTypes.TxResponse.fromJSON(broadcastRawResult.tx_response);

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