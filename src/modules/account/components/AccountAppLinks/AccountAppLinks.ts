import { defineComponent, ref, watchEffect } from "vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import ModalTransaction from "@/ui/components/ModalTransaction/ModalTransaction.vue";

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import { CosmosTxBody, DesmosMsgUnlinkApplication, Transaction, Wallet } from "desmosjs";
import CryptoUtils from "@/utils/CryptoUtils";
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/AuthModule";
import TransactionModule, { TransactionStatus } from "@/store/modules/TransactionModule";
import ChainLink from "@/core/types/ChainLink";
import AccountModule from "@/store/modules/AccountModule";

import AccountApplicationLinkTutorialDiscord from "@/modules/account/components/AccountAppLinks/components/AccountApplicationLinkTutorialDiscord.vue";
import AccountApplicationLinkTutorialGithub from "@/modules/account/components/AccountAppLinks/components/AccountApplicationLinkTutorialGithub.vue";
import AccountApplicationLinkTutorialTwitch from "@/modules/account/components/AccountAppLinks/components/AccountApplicationLinkTutorialTwitch.vue";
import AccountApplicationLinkTutorialTwitter from "@/modules/account/components/AccountAppLinks/components/AccountApplicationLinkTutorialTwitter.vue";
import ApplicationLink from "@/core/types/ApplicationLink";

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
        AccountApplicationLinkTutorialDiscord,
        AccountApplicationLinkTutorialGithub,
        AccountApplicationLinkTutorialTwitch,
        AccountApplicationLinkTutorialTwitter,
    },
    data() {
        return {
            supportedApplicationLinks: ["twitter", "github", "twitch"],
            selectedApplication: null as string | null,
            isApplicationLinkEditorOpen: false,

            applicationUsername: "",
            mPassword: "",
            hasUploadedProof: false,

            isExecutingTransaction: false,
            tx: null as CosmosTxBody | null,
            newApplicationLink: null as ApplicationLink | null,
            deletedApplicationLink: null as ApplicationLink | null,

            generatedProof: null as any | null,
            generateProofError: "",
        }
    },
    beforeMount() {
        ref(transactionModule);
        watchEffect(() => {
            // check if is processing the right transaction and the status
            if (accountModule.user && transactionModule.tx === this.tx && (transactionModule.transactionStatus === TransactionStatus.Error || transactionModule.transactionStatus === TransactionStatus.Success)) {
                if (transactionModule.errorMessage) {
                    // the transaction has an error message, failed
                    console.log('application link failure!')
                } else {
                    // the tx went well! update the data 

                    // handle new application link
                    if (this.tx?.messages[0].typeUrl === "/desmos.profiles.v1beta1.MsgLinkApplication" && this.newApplicationLink) {
                        console.log('application link success!')
                        // application link message sent, now we need also to wait the verification process
                        accountModule.user.applicationLinks.push(this.newApplicationLink);
                    }

                    // handle application unlink
                    if (this.tx?.messages[0].typeUrl === "/desmos.profiles.v1beta1.MsgUnlinkApplication" && this.deletedApplicationLink) {
                        accountModule.user.applicationLinks.slice(accountModule.user.applicationLinks.indexOf(this.deletedApplicationLink), 1);
                        accountModule.user.applicationLinks = accountModule.user.applicationLinks.filter((applicationLink: ApplicationLink) => {
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
        toggleApplicationLinkEditor(): void {
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
                    memo: "Chain unlink",
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
                transactionModule.start(txBody);
            }
        },
        generateProof(): boolean {
            this.generateProofError = "";
            const mPassword = CryptoUtils.sha256(this.mPassword);
            try {
                const mKey = AuthModule.getMKey(mPassword);
                if (mKey) {
                    const privKey = Buffer.from(CryptoUtils.decryptAes(mPassword, mKey), 'hex');
                    const pubKey = Wallet.calculatePubKey(privKey);
                    if (pubKey) {
                        const generatedProof = Transaction.signApplicationLinkData(this.applicationUsername, pubKey, privKey);
                        if (generatedProof) {
                            this.generatedProof = JSON.stringify(generatedProof);
                            console.log(generatedProof)
                            return true;
                        }

                    }
                }
            } catch (e) {
                this.generateProofError = "Invalid Password";
            }
            return false;
        },
        selectApplication(applicationName: string | null): void {
            this.applicationUsername = "";
            this.generatedProof = null;
            if (applicationName === null) {
                this.selectedApplication = null;
            } else {
                this.selectedApplication = applicationName;
            }
        },
        resetGeneratedProof() {
            this.generatedProof = null;
        },
        onApplicationLinkSent(payload: { txBody: CosmosTxBody, applicationLink: ApplicationLink } | null) {
            this.newApplicationLink = null;

            if (payload) {
                this.isApplicationLinkEditorOpen = false;
                this.tx = payload.txBody;
                this.newApplicationLink = payload.applicationLink;
                console.log(this.newApplicationLink.state)
                this.isExecutingTransaction = true;
                transactionModule.start(payload.txBody);
            } else {
                //TODO: replace
                alert('error')
            }
        },
        openApplicationLink(applicationLink: ApplicationLink): void {
            const url = encodeURI(`${applicationLink.url}${applicationLink.username}`);
            window.open(url, '_blank')
        }
    },
});