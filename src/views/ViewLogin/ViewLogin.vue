<template>
  <div>
    <AppHeader />
    <div class="min-h-screen justify-center bg-gray-100 dark:bg-gray-900 px-4 pb-2">
      <div class="pt-14 md:pt-44 w-full">
        <div class="lg:w-4/6 xl:w-1/2 mx-auto bg-gray-50 dark:bg-denim-900 p-4 rounded-3xl shadow-md">
          <div class="flex justify-center">
            <img
              class="max-h-28 w-auto"
              src="public/assets/brands/go-find/logo.svg"
              alt="Workflow"
            >
          </div>

          <div class="flex justify-center">
            <span
              v-if="registerStore.currentState!=='StateRegistrationSuccess'"
              class="pl-4 my-auto text-5xl xl:text-7xl font-extrabold text-gray-900 dark:text-white"
            >
              Sign In
            </span>
          </div>
          <LoginFormUser v-if="loginStore.currentState==='StateELogin'" />
          <LoginFormMPassword v-if="loginStore.currentState==='StateMLogin'" />
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
import LoginFormUser from "@/modules/login/components/LoginFormUser/LoginFormUser.vue";
import LoginFormMPassword from "@/modules/login/components/LoginFormMPassword/LoginFormMPassword.vue";
import { useLoginStore } from "@/stores/LoginModule";
import { useRegisterStore } from "@/stores/RegisterModule";

export default defineComponent({
  components: {
    AppHeader,
    AppFooter,
    LoginFormUser,
    LoginFormMPassword,
  },
  data() {
    return {
      registerStore: useRegisterStore(),
      loginStore: useLoginStore(),
    };
  },
  methods: {},
});
</script>
