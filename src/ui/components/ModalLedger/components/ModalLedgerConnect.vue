<template>
  <span>
    <div class="w-full flex py-4 dark:text-white">
      <div
        class="flex-grow my-auto"
        v-if="ledgerStore.transport&&!ledgerStore.transportError"
      >
        <h5 class="text-xl"><i class="bi bi-circle-fill text-green-500 pr-2 text-sm align-text-bottom" />{{ledgerStore.transport.deviceModel.productName}}</h5>
        <p class="font-mono text-sm">{{ledgerStore.ledgerAddress}}</p>

      </div>
      <p class="text-red-500">{{ledgerStore.transportError}}</p>

      <div class="flex-1 text-right">
        <span v-if="!ledgerStore.isLedgerReady&&!ledgerStore.transport">
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
import { useLedgerStore } from "@/stores/LedgerModule";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {
      ledgerStore: useLedgerStore(),
    };
  },
  methods: {
    async connect() {
      await this.ledgerStore.startLedgerAction();
    },
  },
});
</script>