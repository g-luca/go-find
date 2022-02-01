<template>
  <span>
    <span>
      <Dialog
        :open="$store.state.LedgerModule.isModalOpen"
        @close="toggleModal"
      >
        <div class="fixed inset-0 z-40 overflow-y-auto bg-opacity-50 bg-gray-500">
          <div class="min-h-screen px-4 text-center">
            <span class="inline-block h-screen align-middle"> &#8203; </span>

            <div class="inline-block  w-full sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 2xl:w-4/12 p-6 pb-1 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
              <DialogTitle class="text-3xl font-bold leading-6 text-gray-900 dark:text-white">
                <span class="flex">
                  <div class="text-left my-auto flex">
                    <img
                      class="h-8 w-8 flex-1 pt-1"
                      src="@/assets/brands/ledger/logo.svg"
                      alt=""
                    >
                    <h1 class="dark:text-white text-4xl flex-grow pl-3">Ledger</h1>
                  </div>
                  <div class="flex-auto text-right">
                    <button class="bg-gray-200 dark:bg-gray-800 rounded-full p-1 hover:text-red-500">
                      <i
                        class="bi bi-x h-12 w-12"
                        @click="toggleModal"
                      />
                    </button>
                  </div>
                </span>
              </DialogTitle>
              <DialogOverlay />

              <ModalLedgerConnect />
              <div class="pt-4 text-center dark:text-white text-lg">
                <span v-if="$store.state.LedgerModule.isExecutingActionMessage">
                  Approve the Transaction on your Ledger device
                </span>
                <span v-if="$store.state.LedgerModule.actionSignature!==null">
                  <p class="text-green-500">Success!</p>
                </span>
                <span v-if="$store.state.LedgerModule.actionError">
                  <p class="text-red-500">{{$store.state.LedgerModule.actionError}}</p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </span>
  </span>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "vue";
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";
import ModalLedgerConnect from "@/ui/components/ModalLedger/components/ModalLedgerConnect.vue";

import { getModule } from "vuex-module-decorators";
import LedgerModule from "@/store/modules/LedgerModule";
const ledgerModule = getModule(LedgerModule);

export default defineComponent({
  components: { Dialog, DialogOverlay, DialogTitle, ModalLedgerConnect },
  setup() {
    return {
      isOpen: ref(ledgerModule.isModalOpen),
    };
  },
  methods: {
    async toggleModal() {
      await ledgerModule.toggleModal();
    },
  },
});
</script>