import { defineComponent } from "vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import ModalTransaction from "@/ui/components/ModalTransaction/ModalTransaction.vue";
import { CosmosTypes } from "desmosjs";

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import { supportedChainLinks } from "@/core/types/SupportedChainLinks";
import Blockchain from "@/core/types/Blockchain";
import { Wallet, Secp256k1 } from "desmosjs";
import CryptoUtils from "@/utils/CryptoUtils";

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
        return {
            supportedChainLinks,
            isCustomChain: false,
            customChainName: "",
            customBechPrefix: "",
            selectedChain: null as Blockchain | null,
            customHdpath: '',
            isChainLinkEditorOpen: false,
            isAdvancedOptionsOpen: false,
            isExecutingTransaction: false,
            tx: null as CosmosTypes.TxBody | null,

            generatedProof: "",
            generateProofError: "",

            inputMnemonic: new Array<string>(24),
            //inputMnemonic: ["happy", "upset", "august", "woman", "message", "essay", "victory", "shove", "donate", "slide", "dance", ""]
        }
    }, methods: {
        toggleChainLinkEditor(): void {
            this.isChainLinkEditorOpen = !this.isChainLinkEditorOpen;
            //this.inputMnemonic = new Array<string>(24);
            this.selectedChain = null;
        }, toggleAdvancedOptions(): void {
            this.isAdvancedOptionsOpen = !this.isAdvancedOptionsOpen;
        }, submitChainLink(): void {
            this.toggleChainLinkEditor();
            this.isExecutingTransaction = true;
        },
        handleTxResponse(success: boolean): void {
            if (success) {
                console.log('tx gone ok, updating local account data');
                this.inputMnemonic = new Array<string>(24);
                this.selectedChain = null;
            } else {
                console.log('tx error');
                this.toggleChainLinkEditor();
            }
            this.isExecutingTransaction = false;
        },
        generateProof(): boolean {
            let success = false;
            this.inputMnemonic.forEach((word, i) => {
                this.inputMnemonic[i] = word.trim();
            });
            const mnemonic = this.inputMnemonic.join(' ');
            if (mnemonic.trimEnd().split(' ').length >= 12) {
                try {
                    const wallet = new Wallet(mnemonic, this.customHdpath, this.customBechPrefix);
                    console.log(wallet.address)
                    success = true;

                    console.log(Secp256k1.sign)
                    this.generatedProof = `{
                        "pub_key": {
                          "@type": "${wallet.publicKey.typeUrl}",
                          "key": "${wallet.publicKeyB64}"
                        },
                        "signature": "${Buffer.from(Secp256k1.sign(Buffer.from(CryptoUtils.sha256Buffer(Buffer.from(wallet.address))), wallet.privateKey)).toString('hex')}",
                        "plain_text": "${wallet.address}"
                      }`
                    this.generateProofError = "";
                } catch (e) {
                    console.log(e);
                    this.generateProofError = "Error generating the address";
                }
            } else {
                this.generateProofError = "Invalid mnemonic";
            }
            return success;
        }, selectChain(chain: Blockchain | null): void {
            if (chain === null) {
                this.isCustomChain = true;
                this.selectedChain = null;
                this.customHdpath = '';
                this.customBechPrefix = '';
            } else {
                this.isCustomChain = false;
                this.selectedChain = chain;
                this.customHdpath = chain.hdpath;
                this.customBechPrefix = chain.bechPrefix;
            }
        }
    },
});