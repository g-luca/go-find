import { defineComponent, ref, watchEffect } from "vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import ModalTransaction from "@/ui/components/ModalTransaction/ModalTransaction.vue";
import { CosmosPubKey, CosmosTxBody, DesmosBech32Address, DesmosMsgLinkChainAccount, DesmosMsgUnlinkChainAccount, DesmosProof, Transaction } from "desmosjs";

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import InputMnemonic from "@/ui/components/InputMnemonic.vue";
import { supportedChainLinks } from "@/core/types/SupportedChainLinks";
import Blockchain from "@/core/types/Blockchain";
import { Wallet, } from "desmosjs";
import CryptoUtils from "@/utils/CryptoUtils";
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/AuthModule";
import TransactionModule, { TransactionStatus } from "@/store/modules/TransactionModule";
import ChainLink from "@/core/types/ChainLink";
import AccountModule from "@/store/modules/AccountModule";
import { Key } from "@keplr-wallet/types";
import KeplrModule from "@/store/modules/KeplrModule";
const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);
const transactionModule = getModule(TransactionModule);

class ChainLinkConnectionMethod {
    public id: string;
    public name: string;
    public logo: string;

    constructor(id: string, name: string, logo: string) {
        this.id = id;
        this.name = name;
        this.logo = logo;
    }
}



export default defineComponent({
    components: {
        SkeletonLoader,
        ModalTransaction,
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
        InputMnemonic
    },
    data() {
        return {
            supportedChainLinkConnectionMethods: [new ChainLinkConnectionMethod("keplr", "Keplr", "keplr"), new ChainLinkConnectionMethod("ledger", "Ledger", "ledger"),],
            selectedConnectionMethod: null as ChainLinkConnectionMethod | null,
            supportedChainLinks,
            filteredSupportedChainLinks: supportedChainLinks,
            isCustomChain: false,
            customChainName: "",
            customBechPrefix: "",
            selectedChain: null as Blockchain | null,
            customHdPath: '',
            isChainLinkEditorOpen: false,
            isAdvancedOptionsOpen: false,
            isLinkingWithKeplr: false,
            isExecutingTransaction: false,
            tx: null as CosmosTxBody | null,
            newChainLink: null as ChainLink | null,
            deletedChainLink: null as ChainLink | null,

            generatedProof: null as DesmosProof | null,
            generateProofError: "",

            inputMnemonic: new Array<string>(24),
        }
    },
    beforeMount() {
        ref(transactionModule);
        watchEffect(() => {
            // check if is processing the right transaction and the status
            if (accountModule.profile && transactionModule.tx === this.tx && (transactionModule.transactionStatus === TransactionStatus.Error || transactionModule.transactionStatus === TransactionStatus.Success)) {
                if (transactionModule.errorMessage) {
                    // the transaction has an error message, failed
                    console.log('chain link failure!')
                } else {
                    // the tx went well! update the data 

                    // handle new chain link
                    if (this.tx?.messages[0].typeUrl === "/desmos.profiles.v1beta1.MsgLinkChainAccount" && this.newChainLink) {
                        console.log('chain link success!')
                        accountModule.profile.chainLinks.push(new ChainLink(this.newChainLink.address, this.newChainLink.chain));
                        this.newChainLink = null;
                        this.deletedChainLink = null;
                    }

                    // handle chain unlink
                    if (this.tx?.messages[0].typeUrl === "/desmos.profiles.v1beta1.MsgUnlinkChainAccount" && this.deletedChainLink) {
                        accountModule.profile.chainLinks.slice(accountModule.profile.chainLinks.indexOf(new ChainLink(this.deletedChainLink.address, this.deletedChainLink.chain)), 1);
                        accountModule.profile.chainLinks = accountModule.profile.chainLinks.filter((chainLink: ChainLink) => {
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
        async toggleChainLinkEditor(): Promise<void> {
            this.generateProofError = ''
            this.selectedChain = null;
            this.selectedConnectionMethod = null;
            this.isChainLinkEditorOpen = !this.isChainLinkEditorOpen;
            //this.inputMnemonic = new Array<string>(24);
            this.selectedChain = null;
            this.filteredSupportedChainLinks = this.supportedChainLinks;
            await KeplrModule.setupTerraMainnet();
            await KeplrModule.setupJunoMainnet();
        }, toggleAdvancedOptions(): void {
            this.isAdvancedOptionsOpen = !this.isAdvancedOptionsOpen;
        },
        /**
         * Filter supported chain links by text input
         * @param e input event
         */
        searchChainLink(e: any) {
            const input = (e.target.value as string).toLowerCase();
            if (input) {
                this.filteredSupportedChainLinks = this.supportedChainLinks.filter(x => x.name.toLowerCase().match(input) || x.symbol.toLowerCase().match(input))
            } else {
                this.filteredSupportedChainLinks = this.supportedChainLinks
            }
        },
        /**
         * Delete a connected chain link
         * @param chainLink chainLink to delete
         */
        deleteChainLink(chainLink: ChainLink): void {
            if (authModule.account) {
                const msgUnlink: DesmosMsgUnlinkChainAccount = {
                    chainName: chainLink.chain,
                    owner: authModule.account?.address,
                    target: chainLink.address,
                }
                const txBody: CosmosTxBody = {
                    memo: "Chain unlink",
                    messages: [
                        {
                            typeUrl: "/desmos.profiles.v1beta1.MsgUnlinkChainAccount",
                            value: DesmosMsgUnlinkChainAccount.encode(msgUnlink).finish(),
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
        /**
         * Generate Chain Link proof for users with mnemonic input
         * @returns success value
         */
        async generateProof(): Promise<boolean> {
            let success = false;
            this.inputMnemonic.forEach((word, i) => {
                this.inputMnemonic[i] = word.trim();
            });
            const mnemonic = this.inputMnemonic.join(' ');
            if (mnemonic.trimEnd().split(' ').length >= 12 && authModule.account && this.selectedChain) {
                try {
                    const destWallet = new Wallet(mnemonic, this.customHdPath, this.customBechPrefix);
                    const msgLinkChain: DesmosMsgLinkChainAccount = {
                        chainAddress: {
                            typeUrl: "/desmos.profiles.v1beta1.Bech32Address",
                            value: DesmosBech32Address.encode({
                                prefix: destWallet.bech32Prefix,
                                value: destWallet.address,
                            }).finish()
                        },
                        proof: {
                            pubKey: {
                                typeUrl: destWallet.publicKey.typeUrl,
                                value: CosmosPubKey.encode({
                                    key: destWallet.publicKey.value
                                }).finish()
                            },
                            signature: Buffer.from(Transaction.signBytes(Buffer.from(CryptoUtils.sha256Buffer(Buffer.from(authModule.account.address))), destWallet.privateKey)).toString('hex'),
                            plainText: Buffer.from(authModule.account.address).toString('hex'),
                        }, chainConfig: {
                            name: this.selectedChain?.id.toLowerCase(),
                        },
                        signer: authModule.account?.address,
                    }
                    const txBody: CosmosTxBody = {
                        memo: "Chain link",
                        messages: [
                            {
                                typeUrl: "/desmos.profiles.v1beta1.MsgLinkChainAccount",
                                value: DesmosMsgLinkChainAccount.encode(msgLinkChain).finish(),
                            }
                        ],
                        extensionOptions: [],
                        nonCriticalExtensionOptions: [],
                        timeoutHeight: 0,
                    }
                    this.tx = txBody;
                    this.isExecutingTransaction = true;
                    this.newChainLink = new ChainLink(destWallet.address, this.selectedChain.id);

                    await this.toggleChainLinkEditor();
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
        },
        /**
         * Generate Chain Link proof for user with Keplr
         * @param extKeplrWallet Keplr wallet of the external chain to link
         * @returns success value
         */
        async generateProofWithKeplr(extKeplrWallet: Key): Promise<boolean> {
            let success = false
            if (this.selectedChain) {
                try {

                    // avoid keplr custom values
                    (window.keplr as any).defaultOptions = {
                        sign: {
                            preferNoSetFee: true,
                            preferNoSetMemo: true,
                        }
                    }

                    // get the Keplr signer
                    const signer = window.keplr?.getOfflineSigner(this.selectedChain.chainId);
                    // generate a "fake" transaction to be used as proof
                    const proofObj = {
                        account_number: "0",
                        chain_id: this.selectedChain.chainId,
                        fee: {
                            amount: [{
                                amount: "0",
                                denom: `${this.selectedChain.symbol}`
                            }],
                            gas: "1"
                        },
                        memo: `${authModule.account?.address}`,
                        msgs: [],
                        sequence: "0"
                    }
                    // sign the proof
                    const signedTx = await signer?.signAmino(extKeplrWallet.bech32Address, proofObj); // sign with Keplr
                    const plainText = JSON.stringify(proofObj, null, 0); // convert to string to be used as plain_text

                    // create the chain link transaction
                    if (signedTx && authModule.account) {
                        const msgLinkChain: DesmosMsgLinkChainAccount = {
                            chainAddress: {
                                typeUrl: "/desmos.profiles.v1beta1.Bech32Address",
                                value: DesmosBech32Address.encode({
                                    prefix: this.selectedChain.bechPrefix,
                                    value: extKeplrWallet.bech32Address,
                                }).finish()
                            },
                            proof: {
                                pubKey: {
                                    typeUrl: '/cosmos.crypto.secp256k1.PubKey',
                                    value: CosmosPubKey.encode({
                                        key: extKeplrWallet.pubKey
                                    }).finish()
                                },
                                signature: Buffer.from(signedTx.signature.signature, 'base64').toString('hex'), // need to convert the signature from Base64 to Hex
                                plainText: Buffer.from(plainText).toString('hex'),
                            }, chainConfig: {
                                name: this.selectedChain?.id.toLowerCase(),
                            },
                            signer: authModule.account?.address,
                        }
                        const txBody: CosmosTxBody = {
                            memo: "Chain link",
                            messages: [
                                {
                                    typeUrl: "/desmos.profiles.v1beta1.MsgLinkChainAccount",
                                    value: DesmosMsgLinkChainAccount.encode(msgLinkChain).finish(),
                                }
                            ],
                            extensionOptions: [],
                            nonCriticalExtensionOptions: [],
                            timeoutHeight: 0,
                        }
                        this.isExecutingTransaction = true;
                        this.newChainLink = new ChainLink(extKeplrWallet.bech32Address, this.selectedChain.id);

                        await this.toggleChainLinkEditor();
                        transactionModule.start(txBody);
                        this.tx = txBody;


                        this.generateProofError = "";
                        success = true;
                    } else {
                        this.generateProofError = "Authorization failed";
                    }
                } catch (e) {
                    console.log(e)
                    this.isLinkingWithKeplr = false;
                    this.generateProofError = "";
                }
            }
            return success;
        }, async selectChain(chain: Blockchain | null): Promise<void> {
            if (chain === null) {
                this.isCustomChain = true;
                this.selectedChain = null;
                this.customHdPath = '';
                this.customBechPrefix = '';
            } else {
                this.isCustomChain = false;
                this.selectedChain = chain;
                this.customHdPath = chain.hdpath;
                this.customBechPrefix = chain.bechPrefix;
            }
            this.selectedConnectionMethod = null;
        },

        async selectChainConnectionMethod(connectionMethod: ChainLinkConnectionMethod): Promise<void> {
            this.selectedConnectionMethod = connectionMethod;
        },
        async connectWithKeplr(): Promise<void> {
            try {
                if (window.keplr && this.selectedChain && this.selectedChain.chainId) {
                    // get the dest chain Keplr wallet
                    const keplrWallet = await window.keplr?.getKey(this.selectedChain.chainId);
                    // if the wallet exists & is approved by the user, proceed with the custom chain-link Keplr flow
                    if (keplrWallet.address) {
                        this.isLinkingWithKeplr = true;
                        this.generateProofWithKeplr(keplrWallet);
                        return;
                    }
                } else {
                    this.generateProofError = "Keplr not available";
                }
            } catch (e) {
                this.generateProofError = "Keplr permission denied";
                // persmission to use Keplr refused
            }
            this.isLinkingWithKeplr = false;
        },
        getChainLogo(name: string) {
            try {
                return require('@/assets/brands/' + name + '/logo.svg')
            } catch (e) {
                return '';
            }
        },
        getChainName(nameRaw: string) {
            const supportedChain = supportedChainLinks.find((v) => {
                return v.id === nameRaw;
            });
            if (supportedChain) {
                return supportedChain.name;
            } else {
                return nameRaw;
            }
        }
        , onMnemonic(mnemonic: string) {
            this.inputMnemonic = mnemonic.split(" ");
        }
    },
});