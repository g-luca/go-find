<template>
  <div class="home">
    <AppHeader />
    <LandingHero />
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";
import LandingHero from "@/modules/landing/components/LandingHero/LandingHero.vue";

export default defineComponent({
  components: {
    AppFooter,
    AppHeader,
    LandingHero,
  },
});
</script>
