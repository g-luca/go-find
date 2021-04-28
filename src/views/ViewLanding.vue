<template>
  <div class="home">
    <AppHeader />
    <LandingHero />
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";
import LandingHero from "@/modules/landing/components/LandingHero/LandingHero.vue";

@Options({
  components: {
    AppHeader,
    AppFooter,
    LandingHero,
  },
})
export default class Home extends Vue {}
</script>
