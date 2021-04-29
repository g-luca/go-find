<template>
  <div>
    <AppHeader />
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";

@Options({
  components: {
    AppHeader,
    AppFooter,
  },
})
export default class Login extends Vue {}
</script>
