import { defineComponent, ref, watchEffect } from "vue";
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
import { Wallet, Secp256k1, DesmosTypes } from "desmosjs";
import CryptoUtils from "@/utils/CryptoUtils";
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/AuthModule";
import TransactionModule, { TransactionStatus } from "@/store/modules/TransactionModule";
import ChainLink from "@/core/types/ChainLink";
import AccountModule from "@/store/modules/AccountModule";
const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);
const transactionModule = getModule(TransactionModule);

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
            newChainLink: null as ChainLink | null,
            deletedChainLink: null as ChainLink | null,

            generatedProof: null as DesmosTypes.Proof | null,
            generateProofError: "",

            inputMnemonic: new Array<string>(24),
        }
    },
    beforeMount() {
        ref(transactionModule);
        watchEffect(() => {
            // check if is processing the right transaction and the status
            if (accountModule.user && transactionModule.tx === this.tx && (transactionModule.transactionStatus === TransactionStatus.Error || transactionModule.transactionStatus === TransactionStatus.Success)) {
                if (transactionModule.errorMessage) {
                    // the transaction has an error message, failed
                    console.log('chain link failure!')
                } else {
                    // the tx went well! update the data 

                    // handle new chain link
                    if (this.tx?.messages[0].typeUrl === "/desmos.profiles.v1beta1.MsgLinkChainAccount" && this.newChainLink) {
                        console.log('chain link success!')
                        accountModule.user.chainLinks.push(new ChainLink(this.newChainLink.address, this.newChainLink.chain));
                        this.newChainLink = null;
                        this.deletedChainLink = null;
                    }

                    // handle chain unlink
                    if (this.tx?.messages[0].typeUrl === "/desmos.profiles.v1beta1.MsgUnlinkChainAccount" && this.deletedChainLink) {
                        accountModule.user.chainLinks.slice(accountModule.user.chainLinks.indexOf(new ChainLink(this.deletedChainLink.address, this.deletedChainLink.chain)), 1);
                        accountModule.user.chainLinks = accountModule.user.chainLinks.filter((chainLink: ChainLink) => {
                            return chainLink.address !== this.deletedChainLink?.address && chainLink.chain !== this.deletedChainLink?.chain;
                        });
                        this.newChainLink = null;
                        this.deletedChainLink = null;
                    }
                    this.tx = null;
                }
            }
        })
    }, methods: {
        toggleChainLinkEditor(): void {
            this.isChainLinkEditorOpen = !this.isChainLinkEditorOpen;
            //this.inputMnemonic = new Array<string>(24);
            this.selectedChain = null;
        }, toggleAdvancedOptions(): void {
            this.isAdvancedOptionsOpen = !this.isAdvancedOptionsOpen;
        },
        /**
         * Delete a connected chain link
         * @param chainLink chainLink to delete
         */
        deleteChainLink(chainLink: ChainLink): void {
            if (authModule.account) {
                const msgUnlink: DesmosTypes.MsgUnlinkChainAccount = {
                    chainName: chainLink.chain,
                    owner: authModule.account?.address,
                    target: chainLink.address,
                }
                const txBody: CosmosTypes.TxBody = {
                    memo: "Chain unlink",
                    messages: [
                        {
                            typeUrl: "/desmos.profiles.v1beta1.MsgUnlinkChainAccount",
                            value: DesmosTypes.MsgUnlinkChainAccount.encode(msgUnlink).finish(),
                        }
                    ],
                    extensionOptions: [],
                    nonCriticalExtensionOptions: [],
                    timeoutHeight: 0,
                }
                this.tx = txBody;
                this.newChainLink = null;
                this.deletedChainLink = chainLink;
                transactionModule.start(txBody);
            }
        },
        generateProof(): boolean {
            let success = false;
            this.inputMnemonic.forEach((word, i) => {
                this.inputMnemonic[i] = word.trim();
            });
            const mnemonic = this.inputMnemonic.join(' ');
            if (mnemonic.trimEnd().split(' ').length >= 12 && authModule.account && this.selectedChain) {
                try {
                    const destWallet = new Wallet(mnemonic, this.customHdpath, this.customBechPrefix);
                    const msgLinkChain: DesmosTypes.MsgLinkChainAccount = {
                        chainAddress: {
                            typeUrl: "/desmos.profiles.v1beta1.Bech32Address",
                            value: DesmosTypes.Bech32Address.encode({
                                prefix: destWallet.bech32Prefix,
                                value: destWallet.address,
                            }).finish()
                        },
                        proof: {
                            pubKey: {
                                typeUrl: destWallet.publicKey.typeUrl,
                                value: CosmosTypes.PubKey.encode({
                                    key: destWallet.publicKey.value
                                }).finish()
                            },
                            signature: Buffer.from(Secp256k1.sign(Buffer.from(CryptoUtils.sha256Buffer(Buffer.from(destWallet.address))), destWallet.privateKey)).toString('hex'),
                            plainText: destWallet.address,
                        }, chainConfig: {
                            name: this.selectedChain?.id,
                        },
                        signer: authModule.account?.address,
                    }
                    const txBody: CosmosTypes.TxBody = {
                        memo: "Chain link",
                        messages: [
                            {
                                typeUrl: "/desmos.profiles.v1beta1.MsgLinkChainAccount",
                                value: DesmosTypes.MsgLinkChainAccount.encode(msgLinkChain).finish(),
                            }
                        ],
                        extensionOptions: [],
                        nonCriticalExtensionOptions: [],
                        timeoutHeight: 0,
                    }
                    this.tx = txBody;
                    this.isExecutingTransaction = true;
                    this.newChainLink = new ChainLink(destWallet.address, this.selectedChain.id);

                    this.toggleChainLinkEditor();
                    transactionModule.start(this.tx);

                    success = true;
                    this.generateProofError = "";
                } catch (e) {
                    console.log(e)
                    this.generateProofError = "Error generating the address";
                    this.newChainLink = null;
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