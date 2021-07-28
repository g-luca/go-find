import { defineComponent } from "vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import ModalTransaction from "@/ui/components/ModalTransaction/ModalTransaction.vue";
import { CosmosTypes } from "desmosjs";
import { validateMnemonic } from "bip39";

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";


export default defineComponent({
    components: {
        SkeletonLoader,
        ModalTransaction,
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
    },
    data() {
        const supportedChains = [
            "desmos",
            "cosmos",
            "band"
        ]
        return {
            supportedChains,
            selectedChain: supportedChains[0],
            isChainLinkEditorOpen: true,
            isExecutingTransaction: false,
            tx: null as CosmosTypes.TxBody | null,

            isValidMnemonic: false,
            inputMnemonic: new Array<string>(24),
        }
    }, methods: {
        toggleChainLinkEditor(): void {
            this.isChainLinkEditorOpen = !this.isChainLinkEditorOpen;
            this.inputMnemonic = new Array<string>(24);
        }, submitChainLink(): void {
            this.toggleChainLinkEditor();
            this.isExecutingTransaction = true;
        },
        handleTxResponse(success: boolean): void {
            if (success) {
                console.log('tx gone ok, updating local account data');
                this.inputMnemonic = new Array<string>(24);
            } else {
                console.log('tx error');
                this.toggleChainLinkEditor();
            }
            this.isExecutingTransaction = false;
        },
        validateInputMnemonic(): void {
            this.inputMnemonic.forEach((word, i) => {
                this.inputMnemonic[i] = word.trim();
            });
            const mnemonic = this.inputMnemonic.join(' ');
            if (validateMnemonic(mnemonic)) {
                this.isValidMnemonic = true;
            } else {
                this.isValidMnemonic = false;
            }
        }, selectChain(chain: string): void {
            this.selectedChain = chain;
        }
    },
});