<template>
  <section>
    <Form
      v-slot="{ errors, meta, initialValues}"
      :validation-schema="formSchema"
      :initial-values="initialValues"
      @submit="submitEdit"
    >
      <span v-if="accountStore.profileLoadingStatus">
        <div class="w-full text-center md:text-left dark:text-white">
          <div class="pb-4 pt-8 grid grid-cols-12">
            <div class="col-span-11">
              <h2 class="dark:text-white font-bold text-5xl">
                Welcome back, <span class="text-brand">{{ accountStore.profile.dtag }}</span>
              </h2>
            </div>
            <div class="col-span-1 text-right my-auto">
              <div class="relative inline-block text-left">
                <button
                  v-if="!accountStore.isNewProfile"
                  type="button"
                >
                  <div
                    class="bg-gray-100 dark:bg-gray-800 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700  w-8 h-8"
                    @click="toggleProfileOptionDropdown()"
                  >
                    <i class="bi bi-three-dots-vertical " />
                  </div>
                </button>
                <div
                  v-if="isProfileOptionDropdownVisible"
                  class="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
                >
                  <div
                    class="py-1 "
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <a
                      href="#"
                      class="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 rounded-xl mx-1"
                      role="menuitem"
                    >
                      <span class="flex flex-col">
                        <span @click="deleteProfile()">
                          <i class="bi bi-trash-fill text-red-500" /> Delete Profile
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-4 md:px-0">
            <div class="py-2 font-bold text-xl ">
              <label
                for="nickname"
                class="text-gray-700 dark:text-white py-9 font-bold text-xl "
              >
                Nickname
              </label>
              <Field
                id="nickname"
                v-model="inputNickname"
                type="text"
                class=" rounded-lg flex-1 appearance-none border w-full py-2 px-4 my-1 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                :class="{'border-red-700 dark:border-red-700': errors.nickname,
                         'focus:border-brand dark:focus:border-brand border-gray-300 dark:border-gray-900': !errors.nickname }"
                name="nickname"
                placeholder="Nickname"
              />
              <span
                v-if="errors.nickname"
                class="text-red-700 text-sm"
              >Invalid Nickname (at least 2 characters, max 1000)</span>
            </div>
            <div class="py-2">
              <label
                for="profilePic"
                class="text-gray-700 dark:text-white font-bold text-xl "
              >
                Profile picture
              </label>
              <div class="grid grid-cols-12">
                <div class="col-span-10 md:col-span-11">
                  <Field
                    id="profilePic"
                    v-model="inputProfilePic"
                    type="text"
                    class=" rounded-lg flex-1 appearance-none w-full py-2 px-4 my-1 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                    :class="{'border-red-700 dark:border-red-700': errors.profilePic,
                             'focus:border-brand dark:focus:border-brand border-gray-300 dark:border-gray-900': !errors.profilePic }"
                    name="profilePic"
                    placeholder="https://profile-picture.com/image.png"
                  />
                </div>
                <div class="col-span-2 md:col-span-1 mx-auto align-middle my-auto bg-gray-100 dark:bg-gray-800 rounded-full px-2 p-1 shadow-md">
                  <label class="cursor-pointer bi bi-images hover:text-brand text-2xl fa fa-cloud-upload-fill">
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="openModalUploadImage($event,'profilePic')"
                    >
                  </label>
                </div>
              </div>

              <span
                v-if="errors.profilePic"
                class="text-red-700 text-sm"
              >Invalid image Url</span>
            </div>
            <div class="py-2">
              <label
                for="profileCover"
                class="text-gray-700 dark:text-white font-bold text-xl "
              >
                Cover
              </label>
              <div class="grid grid-cols-12">
                <div class="col-span-10 md:col-span-11">
                  <Field
                    id="profileCover"
                    v-model="inputProfileCover"
                    type="text"
                    class=" rounded-lg flex-1 appearance-none w-full py-2 px-4 my-1 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                    :class="{'border-red-700 dark:border-red-700': errors.profileCover,
                             'focus:border-brand dark:focus:border-brand border-gray-300 dark:border-gray-900': !errors.profileCover }"
                    name="profileCover"
                    placeholder="https://profile-cover.com/image.png"
                  />
                </div>
                <div class="col-span-2 md:col-span-1 mx-auto align-middle my-auto bg-gray-100 dark:bg-gray-800 rounded-full px-2 p-1 shadow-md">
                  <label class="cursor-pointer bi bi-images hover:text-brand text-2xl fa fa-cloud-upload-fill">
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="openModalUploadImage($event,'profileCover')"
                    >
                  </label>
                </div>
              </div>
              <span
                v-if="errors.profileCover"
                class="text-red-700 text-sm"
              >Invalid image Url</span>
            </div>
            <div class="py-2">
              <label
                for="bio"
                class="text-gray-700 dark:text-white font-bold text-xl "
              >
                Bio
              </label>
              <Field
                id="bio"
                v-model="inputBio"
                class=" rounded-lg flex-1 appearance-none w-full py-2 px-4 my-1 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                :class="{'border-red-700 dark:border-red-700': errors.bio,
                         'focus:border-brand dark:focus:border-brand border-gray-300 dark:border-gray-900': !errors.bio }"
                placeholder="Your incredible bio"
                as="textarea"
                name="bio"
                rows="3"
                cols="40"
                @input="markInputBio($event.target.value)"
              />
              <div class="w-full">
                <span
                  v-if="markedInputBio.length>0"
                  class="text-left text-gray-500"
                >
                  Preview
                </span>
                <span class="float-right">
                  <a
                    href="https://www.markdownguide.org/basic-syntax/"
                    target="_blank"
                  >
                    <i class="bi bi-markdown-fill text-gray-700" />
                  </a>
                </span>
              </div>
              <span
                class="prose max-w-none dark:text-white prose-indigo dark:prose-blue"
                v-html="markedInputBio"
              />
              <span
                v-if="errors.bio"
                class="text-red-700 text-sm"
              >Invalid Bio</span>

            </div>
            <div class="grid grid-cols-12 items-center justify-between gap-4 my-6">
              <button
                v-if="transactionStore.transactionStatus!==1&&(meta.valid&&meta.dirty)"
                type="submit"
                :disabled="transactionStore.transactionStatus===1"
                class="py-2 px-4 col-span-9 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                Save changes
              </button>

              <button
                v-if="transactionStore.transactionStatus!==1&&(meta.dirty)"
                type="button"
                :class="{'col-start-10':!meta.valid}"
                class="py-2 px-4 col-span-3 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                @click="handleResetForm()"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </span>
      <span v-else>
        <div class="w-full text-center md:text-left dark:text-white py-4">
          <!-- Loading -->
          <SkeletonLoader
            shape="rectangle"
            class="py-1 text-left w-full md:w-1/2 h-12 px-4"
          />
          <SkeletonLoader
            shape="rectangle"
            class="py-1 text-left w-full md:w-2/5 h-10 px-4"
          />
          <SkeletonLoader
            shape="rectangle"
            class="py-1 text-left w-full md:w-5/6 h-10 px-4"
          />
          <SkeletonLoader
            shape="rectangle"
            class="py-1 text-left w-full md:w-5/6 h-10 px-4"
          />
          <SkeletonLoader
            shape="rectangle"
            class="py-1 text-left w-full md:w-4/6 h-24 px-4"
          />

        </div>
      </span>
    </Form>

    <Dialog
      :open="isModalUploadImageOpen"
      @close="closeModalUploadImage()"
    >
      <div class="fixed inset-0 z-20 overflow-y-auto bg-opacity-50 bg-gray-500">
        <div class="min-h-screen px-4 text-center">
          <span class="inline-block h-screen align-middle"> &#8203; </span>

          <div class="inline-block w-full max-w-6xl p-6 pb-1 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <DialogTitle class="text-3xl font-bold leading-6 text-gray-900 dark:text-white pb-3">
              <span class="flex">
                <div class="flex dark:text-chocolate-500 text-chocolate-500 text-4xl">Upload Image</div>
                <div class="flex-auto text-right">
                  <button>
                    <i
                      class="bi bi-x h-12 w-12"
                      @click="closeModalUploadImage()"
                    />
                  </button>
                </div>
              </span>
            </DialogTitle>
            <div class="w-full">
              <img
                class="mx-auto object-cover pointer-events-none select-none"
                :class="{
                  'rounded-full h-44 w-44 md:h-56 md:w-56': imageUploadType==='profilePic',
                  'rounded-xl max-h-80  w-full': imageUploadType==='profileCover'
                }"
                :src="imageUploadPreviewUrl"
                alt=""
              >
            </div>
            <div class="py-5 align-middle flex">
              <button
                :disabled="isUploadingImage||hasUploadedImage"
                type="button"
                class="mx-auto rounded-2xl bg-chocolate-500 hover:bg-chocolate-600 py-2 w-1/3 text-xl text-white"
                :class="{
                  'brightness-50 cursor-wait':isUploadingImage,
                  'bg-green-600 hover:bg-green-600 cursor-default':!isUploadingImage&&hasUploadedImage&&!hasUploadImageError
                }"
                @click="uploadProfileImage()"
              >
                <span v-if="!isUploadingImage&&!hasUploadedImage">
                  Upload <i class="bi bi-cloud-arrow-up-fill" />
                </span>
                <span v-if="isUploadingImage">
                  Uploading <i class="bi bi-cloud-upload-fill animate animate-bounce h-6 w-6" />
                </span>
                <span v-if="hasUploadedImage">
                  Uploaded <i class="bi bi-check2-circle" />
                </span>
              </button>
            </div>
            <div v-if="hasUploadImageError">
              <p class="text-red-600 text-center">
                {{ hasUploadImageError }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { Form, Field } from "vee-validate";
import { Dialog, DialogTitle } from "@headlessui/vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import {
  CosmosBroadcastMode,
  CosmosTxBody,
  DesmosMsgDeleteProfile,
} from "desmosjs";
import marked from "marked";
import DOMPurify from "dompurify";
import {
  TransactionStatus,
  useTransactionStore,
} from "@/stores/TransactionModule";
import { useAccountStore } from "@/stores/AccountModule";
import { useAuthStore } from "@/stores/AuthModule";
import { MsgSaveProfile } from "@desmoslabs/desmjs-types/desmos/profiles/v1beta1/msgs_profile";

enum UploadImageType {
  "profilePic" = "profilePic",
  "profileCover" = "profileCover",
}

export default defineComponent({
  components: {
    SkeletonLoader,
    Form,
    Field,
    Dialog,
    DialogTitle,
  },
  data() {
    const formSchema = {
      nickname: { min: 2, max: 1000 },
      profilePic: { regex: /^(http)s?:?(\/\/[^"']*$)/ },
      profileCover: { regex: /^(http)s?:?(\/\/[^"']*$)/ },
      bio: { max: 1000 },
    };
    let initialValues = {};
    // set the default values form the accountModule
    const tmpAccountStore = useAccountStore();
    if (tmpAccountStore.profile) {
      initialValues = {
        nickname: tmpAccountStore.profile.nickname,
        profilePic: tmpAccountStore.profile.profilePic,
        profileCover: tmpAccountStore.profile.profileCover,
        bio: tmpAccountStore.profile.bio,
      };
    }
    return {
      authStore: useAuthStore(),
      transactionStore: useTransactionStore(),
      accountStore: useAccountStore(),
      initialValues,
      formSchema,
      txSent: null as CosmosTxBody | null,
      inputNickname: "",
      inputProfilePic: "",
      inputProfileCover: "",
      inputBio: "",
      markedInputBio: "",

      isUploadingImage: false,
      hasUploadImageError: "",
      hasUploadedImage: false,
      isModalUploadImageOpen: false,
      imageUploadPreviewUrl: "",
      imageUploadFile: null as any,
      imageUploadType: UploadImageType.profilePic,

      isProfileOptionDropdownVisible: false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      resetForm: (_values?: unknown) => {
        return;
      },
    };
  },
  async beforeMount() {
    const account = this.authStore.account;
    if (account) {
      await this.accountStore.loadAccount();

      //register the watcher of the accountModule user account profile
      ref(this.accountStore.profile);
      watchEffect(() => {
        if (this.accountStore.profile) {
          this.inputNickname = this.accountStore.profile.nickname;
          this.inputProfilePic = this.accountStore.profile.profilePic;
          this.inputProfileCover = this.accountStore.profile.profileCover;
          this.inputBio = this.accountStore.profile.bio;
        }
      });

      // start listening the transactionStore to intercept the results
      ref(this.transactionStore);
      watchEffect(() => {
        // check if is processing the right transaction and the status
        if (
          this.accountStore.profile &&
          this.transactionStore.tx === this.txSent &&
          (this.transactionStore.transactionStatus ===
            TransactionStatus.Error ||
            this.transactionStore.transactionStatus ===
              TransactionStatus.Success)
        ) {
          if (this.transactionStore.errorMessage) {
            // the transaction has an error message, failed
            console.log("update failure!");
          } else {
            if (
              this.txSent?.messages[0].typeUrl ===
              "/desmos.profiles.v1beta1.MsgDeleteProfile"
            ) {
              this.accountStore.setIsNewProfile();
            } else {
              // the tx went well! update the data
              console.log("update success!");
              this.accountStore.profile.nickname = this.inputNickname;
              this.accountStore.profile.profilePic = this.inputProfilePic;
              this.accountStore.profile.profileCover = this.inputProfileCover;
              this.accountStore.profile.bio = this.inputBio;
              if (this.accountStore.isNewProfile) {
                this.accountStore.setNotNewProfile();
              }
            }
            this.txSent = null;
            this.handleResetForm();
          }
        }
      });
    }
  },
  methods: {
    submitEdit(_data: void, { resetForm }: unknown): void {
      if (this.accountStore.profile) {
        const doNotModify = "[do-not-modify]";
        const msgSaveProfile: MsgSaveProfile = {
          dtag: this.accountStore.profile.dtag,
          nickname:
            this.accountStore.profile.nickname !== this.inputNickname
              ? this.inputNickname
              : doNotModify,
          bio:
            this.accountStore.profile.bio !== this.inputBio
              ? this.inputBio
              : doNotModify,
          profilePicture:
            this.accountStore.profile.profilePic !== this.inputProfilePic
              ? this.inputProfilePic
              : doNotModify,
          coverPicture:
            this.accountStore.profile.profileCover !== this.inputProfileCover
              ? this.inputProfileCover
              : doNotModify,
          creator: this.accountStore.profile.address,
        };
        const txBody: CosmosTxBody = {
          memo: "Profile update | Go-find",
          messages: [
            {
              typeUrl: "/desmos.profiles.v1beta1.MsgSaveProfile",
              value: msgSaveProfile as any,
            },
          ],
          extensionOptions: [],
          nonCriticalExtensionOptions: [],
          timeoutHeight: 0,
        };
        this.txSent = txBody;
        this.transactionStore.start({
          tx: txBody,
          mode: CosmosBroadcastMode.BROADCAST_MODE_BLOCK,
        });

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
      this.markedInputBio = marked(DOMPurify.sanitize(marked(bio)));
    },

    /**
     * Reset the form and the input data
     */
    handleResetForm(): void {
      if (this.accountStore.profile) {
        this.inputNickname = this.accountStore.profile.nickname;
        this.inputProfilePic = this.accountStore.profile.profilePic;
        this.inputProfileCover = this.accountStore.profile.profileCover;
        this.inputBio = this.accountStore.profile.bio;
        this.markedInputBio = marked(
          DOMPurify.sanitize(marked(this.accountStore.profile.bio))
        );
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
        this.hasUploadImageError = "";
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
      this.hasUploadImageError = "";
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
        window.setTimeout(() => {
          this.closeModalUploadImage();
        }, 1000);
      } else {
        this.hasUploadImageError =
          "Ops, something went wrong uploading the image. Try again!";
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
      const ipfsGateway = "https://ipfs.infura.io";

      // prepare the file to be uploaded
      const formData = new FormData();
      formData.append("file", file);

      // try to upload the file
      try {
        const res = await (
          await fetch(`${ipfsGateway}:5001/api/v0/add`, {
            method: "POST",
            body: formData as any,
          })
        ).json();
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
        creator: this.authStore.account!.address,
      };
      const txBody: CosmosTxBody = {
        memo: "Profile delete",
        messages: [
          {
            typeUrl: "/desmos.profiles.v1beta1.MsgDeleteProfile",
            value: msgDeleteProfile as any,
          },
        ],
        extensionOptions: [],
        nonCriticalExtensionOptions: [],
        timeoutHeight: 0,
      };
      this.transactionStore.start({
        tx: txBody,
        mode: CosmosBroadcastMode.BROADCAST_MODE_ASYNC,
      });
      this.txSent = txBody;
      this.toggleProfileOptionDropdown();
    },
    toggleProfileOptionDropdown() {
      this.isProfileOptionDropdownVisible =
        !this.isProfileOptionDropdownVisible;
    },
  },
});
</script>