import { defineComponent, ref, watchEffect } from "vue";

import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";

import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import { getModule } from 'vuex-module-decorators';
import AuthModule from "@/store/modules/AuthModule";
import Error404 from "@/ui/components/errors/Error404.vue";
import ModalTransaction from "@/ui/components/ModalTransaction/ModalTransaction.vue";
import AccountModule from "@/store/modules/AccountModule";
import { DesmosJS, CosmosTypes, DesmosTypes } from "desmosjs";
const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);


export default defineComponent({
    components: {
        AppHeader,
        AppFooter,
        SkeletonLoader,
        Error404,
        ModalTransaction,
    },
    data() {
        return {
            inputNickname: '',
            inputProfilePic: '',
            inputBio: '',

            isInputNicknameValid: false,
            isInputProfilePicValid: false,
            isInputBioValid: false,

            isInputNicknameEdited: false,
            isInputProfilePicEdited: false,
            isInputBioEdited: false,

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
                    nickname: (this.isInputNicknameEdited && this.isInputNicknameValid) ? this.inputNickname : doNotModify,
                    bio: (this.isInputBioEdited && this.isInputBioValid) ? this.inputBio : doNotModify,
                    profilePicture: (this.isInputProfilePicEdited && this.isInputProfilePicValid) ? this.inputProfilePic : doNotModify,
                    coverPicture: doNotModify,
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
        cancelEdit(): void {
            this.inputNickname = (accountModule.user) ? accountModule.user.nickname : '';
            this.inputProfilePic = (accountModule.user) ? accountModule.user.profilePic : '';
            this.inputBio = (accountModule.user) ? accountModule.user.bio : '';

            this.isInputNicknameEdited = false;
            this.isInputProfilePicEdited = false;
            this.isInputBioEdited = false;
        },
        handleTxResponse(success: boolean): void {
            if (success) {
                console.log('tx gone ok, updating local account data');
            } else {
                console.log('tx error');
            }
            this.isExecutingTransaction = false;
        },


        validateInputNickname(): void {
            this.isInputNicknameValid = this.inputNickname.length <= 1000;
            if (accountModule.user) {
                this.isInputNicknameEdited = this.inputNickname !== accountModule.user.nickname;
            }
        },
        validateInputBio(): void {
            this.isInputBioValid = this.inputBio.length <= 1000;
            if (accountModule.user) {
                this.isInputBioEdited = this.inputBio !== accountModule.user.bio;
            }
        },
        validateInputProfilePic(): void {
            this.isInputProfilePicValid = this.inputProfilePic.length === 0 || /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg)$)/.test(this.inputProfilePic);
            if (accountModule.user) {
                this.isInputProfilePicEdited = this.inputProfilePic !== accountModule.user.profilePic;
            }
        }
    }
});