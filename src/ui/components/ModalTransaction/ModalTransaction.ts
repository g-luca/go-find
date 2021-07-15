import { defineComponent } from "vue";
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import { Network, CosmosTypes, DesmosTypes } from "desmosjs";
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/AuthModule";
const authModule = getModule(AuthModule);

export default defineComponent({
    components: {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
    },
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        tx: {
            type: undefined,
            required: true,
        }
    }, emits: ['txResponse'],
    data() {
        return {
            inputMPassword: '',
            isLoading: false,
            txError: '',
            txSuccess: false,
        };
    }, methods: {
        closeModal() {
            this.$emit('txResponse', this.txSuccess);
        },
        async sign() {
            this.txSuccess = false;
            this.isLoading = true;
            this.txError = "";
            try {
                const tx: CosmosTypes.TxBody = this.tx as CosmosTypes.TxBody;
                if (this.tx !== null && this.inputMPassword.length > 0 && authModule.account) {
                    const response = await AuthModule.signTx(tx, authModule.account.address, this.inputMPassword);
                    if (response) {
                        const signedTx = response;
                        const desmosNet = new Network('https://lcd.go-find.me');
                        const broadcastRawResult = await desmosNet.broadcast(signedTx);
                        const broadcastResult = CosmosTypes.TxResponse.fromJSON(broadcastRawResult.tx_response);
                        //TODO: is this check enough?
                        if (broadcastResult.txhash && broadcastResult.rawLog === "") {
                            this.txSuccess = true;
                            window.setTimeout(() => { this.closeModal() }, 2000);
                        } else {
                            this.txSuccess = false;
                            this.txError = broadcastResult.rawLog
                        }
                    } else {
                        const errorMsg = response;
                        this.txError = errorMsg;
                    }
                } else {
                    console.log('invalid auth')
                }
            }
            catch (e) {
                this.txError = "Ops, something went wrong during the transaction broadcast.";
            }
            this.isLoading = false;
        }
    }
});