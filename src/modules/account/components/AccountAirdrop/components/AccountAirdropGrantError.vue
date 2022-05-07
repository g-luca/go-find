<template>
  <span>
    <img
      class="h-52 mx-auto"
      src="public/assets/illustrations/airdrop/claim_error.svg"
      alt=""
    >
    <div class="col-span-12 dark:text-white text-xl text-center pt-8">
      <div>
        {{airdropStore.grantResponse}}
      </div>
    </div>
  </span>
</template>


<script lang="ts">
import { useAirdropStore } from "@/stores/AirdropModule";
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  data() {
    return {
      airdropStore: useAirdropStore(),
    };
  },
  methods: {},
});
</script>