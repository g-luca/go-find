<template>
  <div>
    <div class="min-h-screen justify-center bg-gray-100 dark:bg-gray-900 px-4 pb-2">
      <div class="pt-14 md:pt-44 w-full">
        <div class="lg:w-4/6 xl:w-1/2 mx-auto bg-gray-50 dark:bg-denim-900 p-4 rounded-3xl shadow-md">
          <div class="flex justify-center">
            <img
              class="max-h-28 w-auto"
              src="@/assets/brands/go-find/logo.svg"
              alt="Workflow"
            >
          </div>

          <div class="pt-14">

            <div class="text-center">
              <!-- Dtag -->
              <div>
                <label
                  class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
                  for="dtag"
                > <span v-if="!registerStore.hasDesmosProfile">
                    Choose your
                  </span>
                  <span v-else>
                    Your Desmos
                  </span>
                  <span class="text-brand">dtag</span>
                </label>

                <Form
                  v-slot="{ errors, meta }"
                  :validation-schema="formSchema"
                >
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <Field
                      id="dtag"
                      v-model="inputDtag"
                      :class="{'border-red-700 dark:border-red-700': meta.dirty && (errors.dtag || !isDtagAvailable),
                       'focus:border-brand dark:border-gray-700 ': !errors.dtag}"
                      type="text"
                      name="dtag"
                      class="text-xl md:text-2xl rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                      placeholder="Dtag"
                      @input="validateDtag()"
                    />
                    <div
                      v-if="isValidDtag"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10"
                    >
                      <div v-if="isVerifyingDtagAvailability">
                        <svg
                          class="animate-spin -ml-1 mr-3 h-5 w-5 text-brand"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          />
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>
                      <div v-if="isDtagAvailable&&!isVerifyingDtagAvailability">
                        <i class="bi bi-check-circle text-green-700" />
                      </div>
                      <div v-else-if="!isVerifyingDtagAvailability">
                        <!-- Dtag already taken-->
                        <i class="bi bi-x-circle text-red-700" />
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="errors.dtag"
                    class="text-red-700 text-sm px-2 pt-2 font-light"
                  >
                    <p>Dtags must be 6-30 characters, can contains numbers and underscores.</p>
                  </div>
                  <div
                    v-if="isValidDtag&&!isDtagAvailable&&!isVerifyingDtagAvailability"
                    class="text-red-700 text-sm px-2 pt-2 font-light"
                  >
                    <p>This dtag is already taken.</p>
                  </div>
                </Form>

                <div
                  v-if="!isVerifyingDtagAvailability&&isValidDtag&&isDtagAvailable"
                  class="pt-4"
                >
                  <button
                    type="button"
                    class="relative block w-full justify-center py-2 px-4 border border-transparent text-md rounded-md font-extrabold
               text-white bg-brand opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 dark:ring-offset-denim-900 focus:ring-offset-2 focus:ring-brand"
                    @click="setDtag"
                  >
                    Continue
                    <span class="absolute right-0 inset-y-0 flex items-center pr-3">
                      <i class="bi bi-arrow-right" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
import { useAuthStore } from "@/stores/AuthModule";

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
      registerStore: useRegisterStore(),
      formSchema,
      isValidDtag: false,
      isDtagAvailable: false,
      isVerifyingDtagAvailability: false,
      inputDtag: "",
    };
  },
  mounted() {},
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
              }/desmos/profiles/v1beta1/profiles/` + this.inputDtag
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
    setDtag() {
      useAuthStore().setDtag(this.inputDtag);
    },
  },
});
</script>