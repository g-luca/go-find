<template>
  <div>
    <AppHeader />
    <div class="min-h-screen justify-center bg-gray-100 dark:bg-gray-900 px-4 pb-2">
      <div class="pt-14 md:pt-32 w-full">
        <div class="lg:w-4/6 xl:w-1/2 mx-auto bg-gray-50 dark:bg-denim-900 p-4 rounded-3xl shadow-md">
          <div class="flex justify-center">
            <img
              class="max-h-28 w-auto"
              src="/public/assets/brands/go-find/logo.svg"
              alt="Workflow"
            >
          </div>
          <span
            v-if="registerStore.currentState!=='StateRegistrationSuccess'"
            class="flex justify-center pl-4 my-auto text-3xl xl:text-5xl font-extrabold text-gray-900 dark:text-white"
          >
            Sign Up
          </span>

          <RegisterFormUser v-if="registerStore.currentState==='StateUserInput'" />
          <RegisterFormMPassword v-if="registerStore.currentState==='StateMPasswordInput'" />
          <RegisterNewWallet v-if="registerStore.currentState==='StateWalletGeneration'" />
          <RegisterImportWallet v-if="registerStore.currentState==='StateWalletImport'" />
          <RegisterSuccess v-if="registerStore.currentState==='StateRegistrationSuccess'" />
          <RegisterFail v-if="registerStore.currentState==='StateRegistrationFail'" />
          <RegisterResponseLoading v-if="registerStore.currentState==='StateRegistering'" />
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";
import RegisterFormUser from "@/modules/register/components/RegisterFormUser/RegisterFormUser.vue";
import RegisterNewWallet from "@/modules/register/components/RegisterNewWallet/RegisterNewWallet.vue";
import RegisterSuccess from "@/modules/register/components/RegisterSuccess/RegisterSuccess.vue";
import RegisterImportWallet from "@/modules/register/components/RegisterImportWallet/RegisterImportWallet.vue";
import RegisterFormMPassword from "@/modules/register/components/RegisterFormMPassword/RegisterFormMPassword.vue";
import RegisterFail from "@/modules/register/components/RegisterFail/RegisterFail.vue";
import RegisterResponseLoading from "@/modules/register/components/RegisterResponseLoading/RegisterResponseLoading.vue";
import { useRegisterStore } from "@/stores/RegisterModule";

export default defineComponent({
  components: {
    AppHeader,
    AppFooter,
    RegisterFormUser,
    RegisterFormMPassword,
    RegisterNewWallet,
    RegisterSuccess,
    RegisterFail,
    RegisterImportWallet,
    RegisterResponseLoading,
  },
  data() {
    return {
      registerStore: useRegisterStore(),
    };
  },
  methods: {},
});
</script>
