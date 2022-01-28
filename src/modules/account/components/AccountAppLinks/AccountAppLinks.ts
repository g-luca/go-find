import ApplicationLinkDiscord from '@/core/types/ApplicationLinks/ApplicationLinkDiscord';
import ApplicationLinkDomain from '@/core/types/ApplicationLinks/ApplicationLinkDomain';
import ApplicationLinkTwitch from '@/core/types/ApplicationLinks/ApplicationLinkTwitch';
import ApplicationLinkGithub from '@/core/types/ApplicationLinks/ApplicationLinkGithub';
import ApplicationLinkTwitter from '@/core/types/ApplicationLinks/ApplicationLinkTwitter';
import { defineComponent, ref, watchEffect } from "vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import ModalTransaction from "@/ui/components/ModalTransaction/ModalTransaction.vue";
import ripemd160 from "ripemd160"
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import { CosmosAuthInfo, CosmosBroadcastMode, CosmosTxBody, DesmosMsgUnlinkApplication, Transaction, Wallet } from "desmosjs";
import CryptoUtils from "@/utils/CryptoUtils";
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/AuthModule";
import TransactionModule, { TransactionStatus } from "@/store/modules/TransactionModule";
import AccountModule from "@/store/modules/AccountModule";
import Clipboard from '@/ui/components/Clipboard.vue';
import AccountApplicationLinkTutorialDiscord from "@/modules/account/components/AccountAppLinks/components/AccountApplicationLinkTutorialDiscord.vue";
import AccountApplicationLinkTutorialDiscordVerify from "@/modules/account/components/AccountAppLinks/components/AccountApplicationLinkTutorialDiscordVerify.vue";
import AccountApplicationLinkTutorialGithub from "@/modules/account/components/AccountAppLinks/components/AccountApplicationLinkTutorialGithub.vue";
import AccountApplicationLinkTutorialTwitch from "@/modules/account/components/AccountAppLinks/components/AccountApplicationLinkTutorialTwitch.vue";
import AccountApplicationLinkTutorialTwitter from "@/modules/account/components/AccountAppLinks/components/AccountApplicationLinkTutorialTwitter.vue";
import AccountApplicationLinkTutorialDomain from "@/modules/account/components/AccountAppLinks/components/AccountApplicationLinkTutorialDomain.vue";
import ApplicationLink from "@/core/types/ApplicationLink";
import DesmosNetworkModule from "@/store/modules/DesmosNetworkModule";
import Api from "@/core/api/Api";

const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);
const transactionModule = getModule(TransactionModule);
const desmosNetworkModule = getModule(DesmosNetworkModule);

export default defineComponent({
    components: {
        SkeletonLoader,
        ModalTransaction,
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
        AccountApplicationLinkTutorialDiscord,
        AccountApplicationLinkTutorialDiscordVerify,
        AccountApplicationLinkTutorialGithub,
        AccountApplicationLinkTutorialTwitch,
        AccountApplicationLinkTutorialTwitter,
        AccountApplicationLinkTutorialDomain,
        Clipboard
    },
    data() {
        return {
            supportedApplicationLinks: [
                new ApplicationLinkTwitter(""),
                new ApplicationLinkGithub(""),
                new ApplicationLinkTwitch(""),
                new ApplicationLinkDiscord(""),
                new ApplicationLinkDomain(""),
            ] as ApplicationLink[],
            selectedApplication: null as ApplicationLink | null,
            isApplicationLinkEditorOpen: false,

            applicationUsername: "",
            isValidApplicationUsername: true,
            mPassword: "",

            isExecutingTransaction: false,
            tx: null as CosmosTxBody | null,
            newApplicationLink: null as ApplicationLink | null,
            deletedApplicationLink: null as ApplicationLink | null,

            generatedProof: null as any | null,
            generateProofError: "",
            isGeneratingProof: false,
            isUploadingProof: false,
            hasUploadedProof: false,
            proofUrl: '',


            isModalDiscordVerifyOpen: false,
        }
    },
    beforeMount() {
        ref(transactionModule);
        watchEffect(() => {
            // check if is processing the right transaction and the status
            if (accountModule.profile && transactionModule.tx === this.tx && (transactionModule.transactionStatus === TransactionStatus.Error || transactionModule.transactionStatus === TransactionStatus.Success)) {
                if (transactionModule.errorMessage) {
                    // the transaction has an error message, failed
                    console.log('application link failure!')
                } else {
                    // the tx went well! update the data 

                    // handle new application link
                    if (this.tx?.messages[0].typeUrl === "/desmos.profiles.v1beta1.MsgLinkApplication" && this.newApplicationLink) {
                        console.log('application link success!')
                        // application link message sent, now we need also to wait the verification process
                        accountModule.profile.applicationLinks.push(this.newApplicationLink);

                        // if Discord, reopen the modal to complete the process
                        if (this.newApplicationLink.name === 'discord') {
                            this.toggleModalDiscordVerify();
                        }
                    }

                    // handle application unlink
                    if (this.tx?.messages[0].typeUrl === "/desmos.profiles.v1beta1.MsgUnlinkApplication" && this.deletedApplicationLink) {
                        accountModule.profile.applicationLinks.slice(accountModule.profile.applicationLinks.indexOf(this.deletedApplicationLink), 1);
                        accountModule.profile.applicationLinks = accountModule.profile.applicationLinks.filter((applicationLink: ApplicationLink) => {
                            return applicationLink.username !== this.deletedApplicationLink?.username && applicationLink.name !== this.deletedApplicationLink?.name;
                        });
                        this.newApplicationLink = null;
                        this.deletedApplicationLink = null;
                    }
                    this.tx = null;
                }
            }
        })
    }, methods: {
        async toggleApplicationLinkEditor(): Promise<void> {
            this.isApplicationLinkEditorOpen = !this.isApplicationLinkEditorOpen;
            this.selectedApplication = null;
        },
        /**
         * Delete a connected application link
         * @param applicationLink applicationLink to delete
         */
        deleteApplicationLink(applicationLink: ApplicationLink): void {
            if (authModule.account) {
                const msgUnlink: DesmosMsgUnlinkApplication = {
                    application: applicationLink.name,
                    username: applicationLink.username,
                    signer: authModule.account.address,
                }
                const txBody: CosmosTxBody = {
                    memo: "App unlink | Go-find",
                    messages: [
                        {
                            typeUrl: "/desmos.profiles.v1beta1.MsgUnlinkApplication",
                            value: DesmosMsgUnlinkApplication.encode(msgUnlink).finish(),
                        }
                    ],
                    extensionOptions: [],
                    nonCriticalExtensionOptions: [],
                    timeoutHeight: 0,
                }
                this.tx = txBody;
                this.newApplicationLink = null;
                this.deletedApplicationLink = applicationLink;
                transactionModule.start({
                    tx: txBody,
                    mode: CosmosBroadcastMode.BROADCAST_MODE_SYNC,
                });
            }
        },
        async generateProof(): Promise<boolean> {
            this.isValidApplicationUsername = true;
            if (!this.selectedApplication?.usernameRegExp.test(this.applicationUsername)) {
                this.isValidApplicationUsername = false;
                return false;
            }

            this.isGeneratingProof = true;
            try {
                this.generateProofError = "";
                this.hasUploadedProof = false;
                this.isUploadingProof = false;
                this.proofUrl = '';
                let generatedProof = null as any;
                if (authModule.account?.isUsingKeplr) {
                    const keplrAccount = await window.keplr?.getKey(desmosNetworkModule.chainId);
                    if (keplrAccount) {
                        try {
                            // Get Keplr signer
                            const signer = window.keplr?.getOfflineSigner(desmosNetworkModule.chainId);
                            const address = new ripemd160().update(CryptoUtils.sha256Buffer(Buffer.from(keplrAccount.pubKey))).digest('hex');
                            const pub_key = Buffer.from(keplrAccount.pubKey).toString('hex').toLowerCase();
                            const proofObj = {
                                account_number: "",
                                chain_id: desmosNetworkModule.chainId,
                                fee: {
                                    amount: [{
                                        amount: "0",
                                        denom: ""
                                    }],
                                    gas: "1"
                                },
                                memo: "",
                                msgs: [],
                                sequence: "0"
                            }
                            const signedTx = await signer?.signAmino(keplrAccount.bech32Address, proofObj);
                            if (signedTx) {
                                generatedProof = {
                                    address: address,
                                    pub_key: pub_key,
                                    signature: Buffer.from(signedTx.signature.signature, 'base64').toString('hex'),
                                    value: Buffer.from(JSON.stringify(proofObj, null, 0)).toString('hex')
                                };
                            }
                        } catch (e) {
                            //
                        }
                    }

                    // Wallet Connect custom flow
                    // FIXME: actually not works
                } else if (authModule.account?.isUsingWalletConnect) {
                    const tx = { extensionOptions: [], memo: "Proof", messages: [], nonCriticalExtensionOptions: [], timeoutHeight: 0 }
                    const res = await AuthModule.signAppLinkWithWalletConenct(tx, authModule.account.address);
                    const signedTxRaw = res.signedTxRaw;
                    const doc = res.doc;
                    console.log(signedTxRaw)
                    const proofAuthInfo = CosmosAuthInfo.decode(Buffer.from(signedTxRaw.authInfoBytes, 'hex'));
                    if (proofAuthInfo && proofAuthInfo.signerInfos[0].publicKey) {
                        const pubKeyBytes = proofAuthInfo.signerInfos[0].publicKey.value.slice(2);
                        const pub_key = Buffer.from(pubKeyBytes).toString('hex').toLowerCase();
                        const address = new ripemd160().update(CryptoUtils.sha256Buffer(Buffer.from(pubKeyBytes))).digest('hex');

                        generatedProof = {
                            address: address,
                            pub_key: pub_key,
                            signature: signedTxRaw.signature,
                            value: Buffer.from(JSON.stringify(doc, null, 0)).toString('hex')
                        };
                    }
                } else {
                    const mPassword = CryptoUtils.sha256(this.mPassword);
                    try {
                        const mKey = AuthModule.getMKey(mPassword);
                        if (mKey) {
                            const privKey = Buffer.from(CryptoUtils.decryptAes(mPassword, mKey), 'hex');
                            const pubKey = Wallet.calculatePubKey(privKey);
                            if (pubKey) {
                                generatedProof = Transaction.signApplicationLinkData(this.applicationUsername, pubKey, privKey);
                                //FIXME: temporary fix, this must be done by DesmosJS
                                generatedProof.value = Buffer.from(this.applicationUsername).toString('hex');
                            }
                        }
                    } catch (e) {
                        this.generateProofError = "Invalid Password";
                    }
                }

                if (generatedProof) {
                    this.generatedProof = JSON.stringify(generatedProof);
                    this.isUploadingProof = true;
                    try {
                        const res = await Api.post(`${Api.endpoint}proof`, JSON.stringify({ proof: generatedProof }));
                        if (res.success) {
                            this.hasUploadedProof = true;
                            this.proofUrl = `${Api.endpoint}proof/${res.id}`;
                        }
                    } catch (e) {
                        //
                    }
                    if (this.proofUrl === '') {
                        this.hasUploadedProof = false;
                    }
                    this.isUploadingProof = false;
                }
            } catch (e) {
                // catch all
            }

            this.isGeneratingProof = false;
            return this.proofUrl !== '';
        },
        selectApplication(applicationLink: ApplicationLink): void {
            this.applicationUsername = "";
            this.hasUploadedProof = false;
            this.isUploadingProof = false;
            this.proofUrl = '';
            this.generatedProof = null;
            if (applicationLink !== null) {
                this.selectedApplication = applicationLink;
            }
        },
        resetGeneratedProof() {
            this.generatedProof = null;
        },
        async onApplicationLinkSent(payload: { txBody: CosmosTxBody, applicationLink: ApplicationLink } | null) {
            this.newApplicationLink = null;
            await this.toggleApplicationLinkEditor();

            if (payload) {
                this.isApplicationLinkEditorOpen = false;
                this.tx = payload.txBody;
                this.newApplicationLink = payload.applicationLink;
                this.isExecutingTransaction = true;
                transactionModule.start({
                    tx: payload.txBody,
                    mode: CosmosBroadcastMode.BROADCAST_MODE_SYNC,
                });
            } else {
                //TODO: replace
                console.log('payload error')
            }
        },
        openApplicationLink(applicationLink: ApplicationLink): void {
            window.open(applicationLink.redirectUrl, '_blank')
        },
        async toggleModalDiscordVerify(): Promise<void> {
            this.isModalDiscordVerifyOpen = !this.isModalDiscordVerifyOpen;
        }
    },
});