<template>
  <div>
    <div class="flex justify-center">
      <img
        class="max-h-44 xl:max-h-64"
        src="/assets/illustrations/register/loading_blockchain.svg"
        alt="Success"
      >
    </div>
    <div class="text-center pt-10 xl:pt-20">
      <h1 class="text-4xl xl:text-5xl text-red-700">
        Ops, something went wrong!
      </h1>
    </div>
    <div class="pt-10 w-1/2 mx-auto pb-10 text-center">
      <button
        class="bg-brand text-3xl rounded-2xl focus:outline-none text-white p-2 text-center w-full"
        @click="reset()"
      >
        Try again
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { useRegisterStore } from "@/stores/RegisterModule";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      registerStore: useRegisterStore(),
    };
  },
  methods: {
    reset(): void {
      this.registerStore.reset();
    },
  },
});
</script>