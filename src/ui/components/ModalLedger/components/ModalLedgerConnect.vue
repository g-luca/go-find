<template>
  <span>
    <div class="w-full flex py-4 dark:text-white">
      <div
        class="flex-grow my-auto"
        v-if="$store.state.LedgerModule.transport&&!$store.state.LedgerModule.transportError"
      >
        <h5 class="text-xl"><i class="bi bi-circle-fill text-green-500 pr-2 text-sm align-text-bottom" />{{$store.state.LedgerModule.transport.deviceModel.productName}}</h5>
        <p class="font-mono text-sm">{{$store.state.LedgerModule.ledgerAddress}}</p>

      </div>
      <p class="text-red-500">{{$store.state.LedgerModule.transportError}}</p>

      <div class="flex-1 text-right">
        <span v-if="!$store.state.LedgerModule.isLedgerReady&&!$store.state.LedgerModule.transport">
          <button
            class="rounded-xl px-3 py-1 bg-green-500 hover:bg-green-600  text-white font-light text-sm"
            type="button"
            @click="connect"
          >Connect</button>
        </span>
      </div>
    </div>
  </span>
</template>


<script lang="ts">
import { defineComponent } from "vue";

import { getModule } from "vuex-module-decorators";
import LedgerModule from "@/store/modules/LedgerModule";
const ledgerModule = getModule(LedgerModule);

export default defineComponent({
  setup() {
    return {};
  },
  methods: {
    async connect() {
      await ledgerModule.startLedgerAction();
    },
  },
});
</script>