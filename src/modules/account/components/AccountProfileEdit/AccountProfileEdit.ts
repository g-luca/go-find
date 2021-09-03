import { defineComponent, ref, watchEffect } from "vue";
import { Form, Field, } from 'vee-validate';
import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";

import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import { getModule } from 'vuex-module-decorators';
import AuthModule from "@/store/modules/AuthModule";
import Error404 from "@/ui/components/errors/Error404.vue";
import ModalTransaction from "@/ui/components/ModalTransaction/ModalTransaction.vue";
import AccountBalance from "@/modules/account/components/AccountBalance/AccountBalance.vue";
import AccountChainLinks from "@/modules/account/components/AccountChainLinks/AccountChainLinks.vue";
import AccountModule from "@/store/modules/AccountModule";
import { CosmosTxBody, DesmosMsgSaveProfile } from "desmosjs";
import TransactionModule, { TransactionStatus } from "@/store/modules/TransactionModule";
import marked from "marked";
import { sanitize } from "dompurify";
const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);
const transactionModule = getModule(TransactionModule);

export default defineComponent({
    components: {
        AppHeader,
        AppFooter,
        SkeletonLoader,
        Error404,
        ModalTransaction,
        Form,
        Field,
        AccountBalance,
        AccountChainLinks,
    },
    data() {
        const formSchema = {
            nickname: { max: 1000 },
            profilePic: { regex: /^(http)s?:?(\/\/[^"']*$)/ },
            profileCover: { regex: /^(http)s?:?(\/\/[^"']*$)/ },
            bio: { max: 1000 }
        };
        return {
            initialValues: {},
            formSchema,
            txSent: null as CosmosTxBody | null,
            inputNickname: '',
            inputProfilePic: '',
            inputProfileCover: '',
            inputBio: '',
            markedInputBio: '',
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            resetForm: (_values?: unknown) => { return; }
        }
    },
    async beforeMount() {
        const account = authModule.account;
        if (account) {
            await accountModule.loadAccount();
            // set the default values form the accountModule
            if (accountModule.profile) {
                this.initialValues = {
                    nickname: accountModule.profile.nickname,
                    profilePic: accountModule.profile.profilePic,
                    profileCover: accountModule.profile.profileCover,
                    bio: accountModule.profile.bio,
                }
            }

            //register the watcher of the accountModule user account profile
            ref(accountModule.profile);
            watchEffect(() => {
                if (accountModule.profile) {
                    this.inputNickname = accountModule.profile.nickname;
                    this.inputProfilePic = accountModule.profile.profilePic;
                    this.inputProfileCover = accountModule.profile.profileCover;
                    this.inputBio = accountModule.profile.bio;
                }
            })


            // start listening the transactionModule to intercept the results
            ref(transactionModule);
            watchEffect(() => {
                // check if is processing the right transaction and the status
                if (accountModule.profile && transactionModule.tx === this.txSent && (transactionModule.transactionStatus === TransactionStatus.Error || transactionModule.transactionStatus === TransactionStatus.Success)) {
                    if (transactionModule.errorMessage) {
                        // the transaction has an error message, failed
                        console.log('update failure!')
                    } else {
                        // the tx went well! update the data 
                        console.log('update success!')
                        accountModule.profile.nickname = this.inputNickname;
                        accountModule.profile.profilePic = this.inputProfilePic;
                        accountModule.profile.profileCover = this.inputProfileCover;
                        accountModule.profile.bio = this.inputBio;
                        this.txSent = null;
                        this.handleResetForm();
                    }
                }
            })
        }
    },
    methods: {
        submitEdit(_data: void, { resetForm }: unknown): void {
            if (accountModule.profile) {
                const doNotModify = '[do-not-modify]';
                const msgSaveProfile: DesmosMsgSaveProfile = {
                    dtag: accountModule.profile.dtag,
                    nickname: (accountModule.profile.nickname !== this.inputNickname) ? this.inputNickname : doNotModify,
                    bio: (accountModule.profile.bio !== this.inputBio) ? this.inputBio : doNotModify,
                    profilePicture: (accountModule.profile.profilePic !== this.inputProfilePic) ? this.inputProfilePic : doNotModify,
                    coverPicture: (accountModule.profile.profileCover !== this.inputProfileCover) ? this.inputProfileCover : doNotModify,
                    creator: accountModule.profile.address,
                }
                const txBody: CosmosTxBody = {
                    memo: "Profile update",
                    messages: [
                        {
                            typeUrl: "/desmos.profiles.v1beta1.MsgSaveProfile",
                            value: DesmosMsgSaveProfile.encode(msgSaveProfile).finish(),
                        }
                    ],
                    extensionOptions: [],
                    nonCriticalExtensionOptions: [],
                    timeoutHeight: 0,
                }
                transactionModule.start(txBody);
                this.txSent = txBody;

                // Vee Validate send as parameter the reset function, i need to save it to use for the reset after an update
                // This may be fixed by Vee itself in future https://github.com/logaretm/vee-validate/issues/3292
                this.resetForm = resetForm;
            }
        },
        /**
         * Convert the input bio in markdown html
         * @param bio input bio
         */
        markInputBio(bio: string) {
            this.markedInputBio = sanitize(marked(bio));
        },

        /**
         * Reset the form and the input data
         */
        handleResetForm(): void {
            if (accountModule.profile) {
                this.inputNickname = accountModule.profile.nickname;
                this.inputProfilePic = accountModule.profile.profilePic;
                this.inputProfileCover = accountModule.profile.profileCover;
                this.inputBio = accountModule.profile.bio;
                this.markedInputBio = sanitize(marked(accountModule.profile.bio));
                this.resetForm({
                    values: {
                        nickname: this.inputNickname,
                        profilePic: this.inputProfilePic,
                        profileCover: this.inputProfileCover,
                        bio: this.inputBio,
                    },
                });
            }
        }

    }
});