<template>
  <div class="">
    <div class="mt-8 space-y-6 w-11/12 mx-auto">
      <h2 class="font-bold text-2xl text-brand">
        Wallet Password
      </h2>
      <!-- Password -->
      <div>
        <label class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl">Password</label>
        <input
          v-model="inputMPassword"
          :class="{'border-red-700 dark:border-red-700': hasLoginError,'border-gray-300 dark:border-gray-500': !hasLoginError, 'focus:border-brand dark:border-gray-700': !isTouched}"
          type="password"
          required="required"
          class="relative block w-full px-3 py-2 mt-2 border placeholder-gray-300 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-600 dark:text-white"
          placeholder="Wallet Password"
        >
      </div>
      <span v-if="hasLoginError">
        <p class="font-semibold text-lg pt-2 dark:text-white">
          <i class="bi bi-exclamation-circle-fill text-red-500" /> Wrong Wallet password.
        </p>
      </span>

      <div>
        <button
          v-if="inputMPassword.length>3"
          type="button"
          class="relative block w-full justify-center py-2 px-4 border border-transparent text-md rounded-md font-extrabold
               text-white bg-brand opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-denim-900 focus:ring-brand"
          @click="signin()"
        >
          Continue
          <span class="absolute right-0 inset-y-0 flex items-center pr-3">
            <i class="bi bi-arrow-right" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
        
<script lang="ts">
import AuthAccount from "@/core/types/AuthAccount";
import { Profile } from "@/core/types/Profile";
import LinkBlockSample from "@/modules/landing/components/LinkBlockSample/LinkBlockSample.vue";
import router from "@/router";
import { useAuthStore } from "@/stores/AuthModule";
import { useLoginStore } from "@/stores/LoginModule";
import CryptoUtils from "@/utils/CryptoUtils";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    LinkBlockSample,
  },
  data() {
    return {
      authStore: useAuthStore(),
      loginStore: useLoginStore(),
      isValidMPassword: false,
      hasLoginError: false,
      isTouched: false,
      inputMPassword: "",
    };
  },
  methods: {
    validatePassword() {
      this.isValidMPassword = Profile.PASSWORD_REGEX.test(this.inputMPassword);
    },
    signin() {
      this.validatePassword();
      if (this.isValidMPassword) {
        const mPassword = CryptoUtils.sha256(this.inputMPassword); // generate hashed mPassword
        try {
          //ePaassword is already hashed
          const mKeyRaw = CryptoUtils.decryptAes(
            this.loginStore.ePassword,
            this.loginStore.eKey
          ); // decrypt mKey
          const mKey = mKeyRaw.split("#ok")[0];
          CryptoUtils.decryptAes(mPassword, mKey); // try to decrypt privKey
          this.hasLoginError = false;
          this.authStore.saveMKey({ mKey, mPassword });

          this.authStore.saveAuthAccount({
            account: new AuthAccount(
              this.loginStore.dtag,
              this.loginStore.address,
              false
            ),
          });
          this.loginStore.reset();
          router.push({ path: "/me" });
        } catch (e) {
          console.log(e);
          this.hasLoginError = true;
        }
      } else {
        this.hasLoginError = true;
      }
    },
  },
});
</script>
