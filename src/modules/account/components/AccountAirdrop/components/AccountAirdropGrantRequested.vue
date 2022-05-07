<template>
  <span>
    <img
      class="h-52 mx-auto"
      src="public/assets/illustrations/airdrop/claim_success.svg"
      alt=""
    >
    <div class="col-span-12 dark:text-white text-xl text-center pt-8">
      <div>
        Your grant has been requested and it will be processed shortly.
      </div>
      <div class="pt-2">
        <svg
          class="animate-spin mx-auto h-7 w-7 text-brand"
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
    </div>
  </span>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  methods: {},
});
</script>