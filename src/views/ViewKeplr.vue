<template>
  <div>
    <AppHeader />
    <div class="min-h-screen justify-center bg-gray-100 dark:bg-gray-900 px-4 pb-2">
      <div class="pt-14 md:pt-44 w-full">
        <div class="lg:w-4/6 xl:w-1/2 mx-auto bg-gray-50 dark:bg-denim-900 p-4 rounded-3xl shadow-md">
          <div class="flex justify-center">
            <img
              class="max-h-28 w-auto"
              src="@/assets/brands/go-find/logo.svg"
            >
          </div>

          <div class="flex justify-center">
            <span class="mt-4 py-1 px-1 flex justify-center items-center">
              <img
                class="max-h-16"
                src="@/assets/brands/keplr/logo.svg"
              >
              <span class="pl-3 text-5xl xl:text-7xl font-extrabold text-gray-900 dark:text-white">
                Keplr
              </span>
            </span>
          </div>

          <div class="pt-14">
            <!-- Keplr not installed -->
            <span v-if="!keplrStore.isInstalled">
              <div class="text-center">
                <p class="text-xl text-red-600">Keplr is not installed or available</p>
              </div>
            </span>

            <!-- Keplr installed & blocked-->
            <span v-if="keplrStore.isInstalled&&keplrStore.isWaitingAuthentication">
              <div class="text-center">
                <p class="text-xl text-yellow-500">Waiting Keplr authentication</p>
              </div>
            </span>

            <!-- Keplr installed & unlocked -->
            <span v-if="keplrStore.isInstalled&&!keplrStore.isWaitingAuthentication&&!keplrStore.hasProfile">
              <div class="text-center">
                <!-- TODO: improve Loading UX -->
                <p class="text-xl text-yellow-500">Loading...</p>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>


<script lang="ts">
import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";
import { defineComponent } from "vue";
import { Profile } from "@/core/types/Profile";
import Api from "@/core/api/Api";
import { Field, Form } from "vee-validate";
import { useRegisterStore } from "@/stores/RegisterModule";
import { useKeplrStore } from "@/stores/KeplrModule";

export default defineComponent({
  components: {
    AppFooter,
    AppHeader,
    Field,
    Form,
  },
  data() {
    const formSchema = {
      dtag: { required: true, regex: Profile.DTAG_REGEX },
    };
    return {
      keplrStore: useKeplrStore(),
      registerStore: useRegisterStore(),
      formSchema,
      isValidDtag: false,
      isDtagAvailable: false,
      isVerifyingDtagAvailability: false,
      inputDtag: "",
    };
  },
  mounted() {
    this.keplrStore.connect();
  },
  methods: {
    validateDtag() {
      this.isDtagAvailable = false;
      this.isValidDtag = Profile.DTAG_REGEX.test(this.inputDtag);
      if (this.isValidDtag) {
        this.isVerifyingDtagAvailability = true;
        const dtag = this.inputDtag.toString(); // deep copy
        setTimeout(() => {
          if (this.inputDtag === dtag) {
            // verify if the dtag is not changed while waiting the timeout
            Api.get(
              `${
                import.meta.env.VITE_APP_LCD_ENDPOINT
              }/desmos/profiles/v2/profiles/` + this.inputDtag
            ).then((response) => {
              if (this.inputDtag === dtag && response["profile"]) {
                // dtag already taken
                this.isDtagAvailable = false;
              } else {
                this.isDtagAvailable = true;
              }
              this.isVerifyingDtagAvailability = false;
            });
          } else {
            this.isVerifyingDtagAvailability = false;
          }
        }, 200);
      }
      return this.isValidDtag;
    },
  },
});
</script>