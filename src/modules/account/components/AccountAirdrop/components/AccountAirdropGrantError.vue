<template>
  <span>
    <img
      class="h-52 mx-auto"
      src="@/assets/illustrations/airdrop/claim_error.svg"
      alt=""
    >
    <div class="col-span-12 dark:text-white text-xl text-center pt-8">
      <div>
        {{$store.state.AirdropModule.grantResponse}}
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