import { defineComponent, ref, watchEffect } from "vue";
import { Form, Field } from 'vee-validate';
import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";

import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import { getModule } from 'vuex-module-decorators';
import AuthModule from "@/store/modules/AuthModule";
import Error404 from "@/ui/components/errors/Error404.vue";
import ModalTransaction from "@/ui/components/ModalTransaction/ModalTransaction.vue";
import AccountBalance from "@/modules/account/components/AccountBalance/AccountBalance.vue";
import AccountModule from "@/store/modules/AccountModule";
import { CosmosTypes, DesmosTypes } from "desmosjs";
const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);

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
    },
    data() {
        const formSchema = {
            nickname: { max: 1000 },
            profilePic: { regex: /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg)$)/ },
            profileCover: { regex: /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg)$)/ },
            bio: { max: 1000 }
        };
        return {
            formSchema,
            inputNickname: '',
            inputProfilePic: '',
            inputProfileCover: '',
            inputBio: '',

            isExecutingTransaction: false,
            tx: null as CosmosTypes.TxBody | null,

        }
    },
    async mounted() {
        const account = authModule.account;
        if (account) {
            await accountModule.loadAccount();


            //register the watcher of the accountModule user account profile
            ref(accountModule.user);
            watchEffect(() => {
                if (accountModule.user) {
                    this.inputNickname = accountModule.user.nickname;
                    this.inputProfilePic = accountModule.user.profilePic;
                    this.inputProfileCover = accountModule.user.profileCover;
                    this.inputBio = accountModule.user.bio;
                }
            })

        }
    },
    methods: {
        submitEdit(): void {
            if (accountModule.user) {
                const doNotModify = '[do-not-modify]';
                const msgSaveProfile: DesmosTypes.MsgSaveProfile = {
                    dtag: accountModule.user.username,
                    nickname: (accountModule.user.nickname !== this.inputNickname) ? this.inputNickname : doNotModify,
                    bio: (accountModule.user.bio !== this.inputBio) ? this.inputBio : doNotModify,
                    profilePicture: (accountModule.user.profilePic !== this.inputProfilePic) ? this.inputProfilePic : doNotModify,
                    coverPicture: (accountModule.user.profileCover !== this.inputProfileCover) ? this.inputProfileCover : doNotModify,
                    creator: accountModule.user.address,
                }
                const txBody: CosmosTypes.TxBody = {
                    memo: "Profile update",
                    messages: [
                        {
                            typeUrl: "/desmos.profiles.v1beta1.MsgSaveProfile",
                            value: DesmosTypes.MsgSaveProfile.encode(msgSaveProfile).finish(),
                        }
                    ],
                    extensionOptions: [],
                    nonCriticalExtensionOptions: [],
                    timeoutHeight: 0,
                }
                this.tx = txBody;
                this.isExecutingTransaction = true;
            }
        },
        handleTxResponse(success: boolean): void {
            if (success) {
                console.log('tx gone ok, updating local account data');
            } else {
                console.log('tx error');
            }
            this.isExecutingTransaction = false;
        },

    }
});