import { defineComponent, ref, watchEffect } from "vue";
import { Form, Field } from 'vee-validate';
import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";


import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import { getModule } from 'vuex-module-decorators';
import AuthModule from "@/store/modules/AuthModule";
import Error404 from "@/ui/components/errors/Error404.vue";
import ModalTransaction from "@/ui/components/ModalTransaction/ModalTransaction.vue";
import AccountBalance from "@/modules/account/components/AccountBalance/AccountBalance.vue";
import AccountChainLinks from "@/modules/account/components/AccountChainLinks/AccountChainLinks.vue";
import AccountModule from "@/store/modules/AccountModule";
import { CosmosBroadcastMode, CosmosTxBody, DesmosMsgDeleteProfile, DesmosMsgSaveProfile } from "desmosjs";
import TransactionModule, { TransactionStatus } from "@/store/modules/TransactionModule";
import { marked } from "marked";
import { sanitize } from "dompurify";
const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);
const transactionModule = getModule(TransactionModule);

enum UploadImageType {
    'profilePic' = 'profilePic',
    'profileCover' = 'profileCover'
}

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
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
    },
    data() {
        const formSchema = {
            nickname: { min: 2, max: 1000 },
            profilePic: { regex: /^(http)s?:?(\/\/[^"']*$)/ },
            profileCover: { regex: /^(http)s?:?(\/\/[^"']*$)/ },
            bio: { max: 1000 }
        };
        let initialValues = {}
        // set the default values form the accountModule
        if (accountModule.profile) {
            initialValues = {
                nickname: accountModule.profile.nickname,
                profilePic: accountModule.profile.profilePic,
                profileCover: accountModule.profile.profileCover,
                bio: accountModule.profile.bio,
            }
        }
        return {
            initialValues,
            formSchema,
            txSent: null as CosmosTxBody | null,
            inputNickname: '',
            inputProfilePic: '',
            inputProfileCover: '',
            inputBio: '',
            markedInputBio: '',

            isUploadingImage: false,
            hasUploadImageError: '',
            hasUploadedImage: false,
            isModalUploadImageOpen: false,
            imageUploadPreviewUrl: '',
            imageUploadFile: null as any,
            imageUploadType: UploadImageType.profilePic,

            isProfileOptionDropdownVisible: false,


            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            resetForm: (_values?: unknown) => { return; }
        }
    },
    async beforeMount() {
        const account = authModule.account;
        if (account) {

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
                        if (this.txSent?.messages[0].typeUrl === '/desmos.profiles.v2.MsgDeleteProfile') {
                            accountModule.setIsNewProfile();
                        } else {
                            // the tx went well! update the data 
                            console.log('update success!')
                            accountModule.profile.nickname = this.inputNickname;
                            accountModule.profile.profilePic = this.inputProfilePic;
                            accountModule.profile.profileCover = this.inputProfileCover;
                            accountModule.profile.bio = this.inputBio;
                            if (accountModule.isNewProfile) {
                                accountModule.setNotNewProfile();
                            }
                        }
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
                            typeUrl: "/desmos.profiles.v2.MsgSaveProfile",
                            value: DesmosMsgSaveProfile.encode(msgSaveProfile).finish(),
                        }
                    ],
                    extensionOptions: [],
                    nonCriticalExtensionOptions: [],
                    timeoutHeight: 0,
                }
                transactionModule.start({
                    tx: txBody,
                    mode: CosmosBroadcastMode.BROADCAST_MODE_ASYNC,
                });
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
        },

        openModalUploadImage(e: any, type: UploadImageType) {
            // retrieve the image
            this.imageUploadFile = null;
            try {
                const image = e.target.files[0] || e.dataTransfer.files[0];
                this.imageUploadFile = image;
                this.imageUploadType = type;
                this.imageUploadPreviewUrl = URL.createObjectURL(image);
                this.isModalUploadImageOpen = true;
                this.isUploadingImage = false;
                this.hasUploadImageError = '';
                this.hasUploadedImage = false;
            } catch (e) {
                // input file removed
            }
        },
        closeModalUploadImage() {
            this.isModalUploadImageOpen = false;
        },


        /**
         * Upload generic profile image (using IPFS)
         * @param image image file
         */
        async uploadProfileImage() {
            this.isUploadingImage = true;
            this.hasUploadedImage = false;
            this.hasUploadImageError = '';
            const uploadedImageUrl = await this.uploadFileIpfs(this.imageUploadFile);
            if (uploadedImageUrl !== false) {
                this.hasUploadedImage = true;
                switch (this.imageUploadType) {
                    case UploadImageType.profilePic:
                        this.inputProfilePic = uploadedImageUrl;
                        break;

                    case UploadImageType.profileCover:
                        this.inputProfileCover = uploadedImageUrl;
                        break;
                }
                window.setTimeout(() => { this.closeModalUploadImage() }, 1000)
            } else {
                this.hasUploadImageError = 'Ops, something went wrong uploading the image. Try again!';
            }
            this.isUploadingImage = false;
        },

        /**
         * Upload a file to IPFS
         * @param file file to upload
         * @returns uploaded file URL if uploaded successfully, false otherwise
         */
        async uploadFileIpfs(file: any): Promise<string | false> {

            // define the IPFS gateway
            const ipfsGateway = 'https://ipfs.infura.io';

            // prepare the file to be uploaded
            const formData = new FormData();
            formData.append('file', file);

            // try to upload the file
            try {
                const res = await (await fetch(`${ipfsGateway}:5001/api/v0/add`, {
                    method: 'POST',
                    body: formData as any,
                })).json();
                // if uploaded, get the response CID
                const cid = res.Hash;
                if (cid) {
                    return `${ipfsGateway}/ipfs/${cid}`;
                }
            } catch (e) {
                // damn, upload failed!
            }
            return false;
        },
        async deleteProfile() {
            const msgDeleteProfile: DesmosMsgDeleteProfile = {
                creator: authModule.account!.address,
            }
            const txBody: CosmosTxBody = {
                memo: "Profile delete",
                messages: [
                    {
                        typeUrl: "/desmos.profiles.v2.MsgDeleteProfile",
                        value: DesmosMsgDeleteProfile.encode(msgDeleteProfile).finish(),
                    }
                ],
                extensionOptions: [],
                nonCriticalExtensionOptions: [],
                timeoutHeight: 0,
            }
            transactionModule.start({
                tx: txBody,
                mode: CosmosBroadcastMode.BROADCAST_MODE_ASYNC,
            });
            this.txSent = txBody;
            this.toggleProfileOptionDropdown();
        },
        toggleProfileOptionDropdown() {
            this.isProfileOptionDropdownVisible = !this.isProfileOptionDropdownVisible;
        }


    }
});