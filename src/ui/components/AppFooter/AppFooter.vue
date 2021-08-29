<template>
  <footer
    class="py-8 px-10 md:px-20 lg:px-32 dark:text-gray-100"
    :class="{'bg-white dark:bg-gray-900 ':!forceBlack,'bg-black text-gray-100':forceBlack}"
  >
    <div class="grid grid-cols-12 pt-10 pb-10">
      <div class="col-span-4 md:col-span-2 my-auto text-center py-2">
        <a
          class="px-4 font-medium hover:underline hover:cursor-pointer text-lg"
          href="https://github.com/g-luca/go-find/issues/new"
          target="_blank"
        >Support</a>
      </div>

      <div class="col-span-4 md:col-span-2 my-auto text-center py-2">
        <a
          class="px-4 font-medium hover:underline hover:cursor-pointer text-lg"
          href="/#faq"
        >F.A.Q.</a>
      </div>

      <div class="col-span-12 md:col-span-4 text-center my-auto hidden md:inline">
        <img
          src="@/assets/brands/go-find/logo.svg"
          class="mx-auto object-cover h-10 w-10 rounded-md"
        >
      </div>

      <div class="col-span-4 md:col-span-2 my-auto text-center py-2">
        <a
          class="px-4 font-medium hover:underline hover:cursor-pointer text-lg"
          href="https://morpheus.desmos.network/validators/desmosvaloper16c60y8t8vra27zjg2arlcd58dck9cwn7lhp6pl"
          target="_blank"
        >Staking</a>
      </div>

      <div class="col-span-12 md:col-span-2 my-auto text-center py-2">
        <a
          class="px-4 font-medium hover:underline hover:cursor-pointer text-lg"
          href="https://github.com/g-luca/go-find"
          target="_blank"
        >Contribute</a>
      </div>
    </div>

    <div class="grid grid-cols-12 pt-10 border-t border-gray-500">
      <div class="col-span-12 md:col-span-4 my-auto text-center py-1">
        <h5 class="px-4  text-lg">
          <span class="flex justify-center font-semibold pb-1">
            <img
              src="@/assets/brands/go-find/logo.svg"
              class="object-cover h-6 w-6 rounded-md"
            >o-find.me <span class="text-gray-500 font-extralight"> &nbsp; | &nbsp; © 2021 </span></span>
          <span class="px-4 py-0.5 text-white font-medium text-md rounded-xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700">
            Beta
          </span>
        </h5>
      </div>
      <div class="col-span-12 md:col-span-4 text-center text-gray-500 my-auto py-1">
        <h5>
          Because we
          <i class="bi bi-heart-fill w-5 h-5 text-red-600 inline pb-1" />
          Open Source
        </h5>
        <h4>We do not use cookies 🍪</h4>
      </div>

      <div class="col-span-12 md:col-span-4 text-center py-1 my-auto">
        <span class="flex justify-center">
          <div class="px-4">
            <ToggleLanguage />
          </div>
          <div class="flex px-4 py-0.5 text-gray-500 my-auto font-light text-sm">
            <span v-if="$store.state.StatusModule.status === 0">
              Online
            </span>
            <span v-if="$store.state.StatusModule.status === 1">
              Connecting..
            </span>
            <span v-if="$store.state.StatusModule.status === 2">
              Not Synched
            </span>
            <span class="ml-2 h-3 w-3 ">
              <span
                class="animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 mt-0.5"
                :class="{
                  'bg-green-500':$store.state.StatusModule.status === 0,
                  'bg-yellow-500':$store.state.StatusModule.status === 1,
                  'bg-red-500':$store.state.StatusModule.status === 2
                }"
              />
              <span
                class="relative inline-flex rounded-full h-3 w-3"
                :class="{
                  'bg-green-500':$store.state.StatusModule.status === 0,
                  'bg-yellow-500':$store.state.StatusModule.status === 1,
                  'bg-red-500':$store.state.StatusModule.status === 2
                }"
              />
            </span>
          </div>
        </span>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ToggleLanguage from "@/ui/components/ToggleLanguage/ToggleLanguage.vue";
import { getModule } from "vuex-module-decorators";
import StatusModule from "@/store/modules/StatusModule";
const statusModule = getModule(StatusModule);
statusModule.startStatusListening();

export default defineComponent({
  components: { ToggleLanguage },
  props: {
    forceBlack: {
      type: Boolean,
      default: false,
    },
  },
});
</script>