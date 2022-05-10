<template>
  <div>
    <Clipboard />
    <AppHeader />
    <!-- Link is present in the URL -->
    <span v-if="requestedLink.length>0">
      <div class="w-full bg-gradient-to-br to-purple-600 via-royalblue-800 from-royalblue-900 pt-14">
        <div class="min-h-screen h-screen">
          <img
            src="/public/assets/illustrations/user/link-loading.svg"
            class="h-1/2 mx-auto"
          >
          <div class="pt-10">
            <h1 class="text-4xl md:text-7xl text-center text-white ">
              Skyrocketing to <span class="text-brand font-medium pr-3"> @{{ $route.params['dtag'] }} </span>
              <span class="text-transparent bg-clip-text bg-gradient-to-br from-royalblue-200 via-royalblue-300 to-royalblue-400 font-bold capitalize">{{ requestedLink }}
              </span>

              <div
                v-if="matchedLinks.length>1"
                class="pt-6"
              >
                <div
                  v-for="appLink of matchedLinks"
                  class="rounded-xl shadow-2xl my-6 py-4 bg-gradient-to-br hover:bg-gradient-to-tl from-black-900 via-royalblue-900 to-blue-900 text-white text-center text-2xl w-2/4 lg:w-1/4 mx-auto cursor-pointer"
                  @click="redirectTo(appLink)"
                >
                  @{{appLink.username}}
                </div>

              </div>

            </h1>
          </div>
        </div>
      </div>
    </span>
    <span v-else>
      <div class="w-full dark:bg-denim-900 bg-gray-50">
        <span v-if="profileStore.profileLoadingStatus>=0">
          <!-- Profile Heading -->
          <ProfileHeading />

          <!-- Profile App Links -->
          <ProfileAppLinks />

        </span>
        <span v-else>
          <Error404 :message="'The user is not here'" />
        </span>
      </div>
    </span>

    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";

import ApolloQuery from "vue-apollo";
import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";
import Clipboard from "@/ui/components/Clipboard.vue";
import ProfileHeading from "@/modules/profile/components/ProfileHeading/ProfileHeading.vue";
import ProfileAppLinks from "@/modules/profile/components/ProfileAppLinks/ProfileAppLinks.vue";
import Error404 from "@/ui/components/errors/Error404.vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import { supportedSocialNetworks } from "@/core/types/SupportedSocialNetworks";
import ApplicationLink from "@/core/types/ApplicationLink";
import { useProfileStore } from "@/stores/ProfilleModule";

export default defineComponent({
  components: {
    AppHeader,
    AppFooter,
    Clipboard,
    SkeletonLoader,
    Error404,
    ProfileHeading,
    ProfileAppLinks,
    ApolloQuery,
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params["dtag"] !== from.params["dtag"]) {
      useProfileStore().loadUser({
        dtag: to.params["dtag"].toLocaleString(),
        address: "",
      });
      this.parseLink(to.params["link"].toLocaleString());
    }
    next();
  },
  data() {
    return {
      requestedLink: "",
      matchedLinks: [] as ApplicationLink[],
      profileStore: useProfileStore(),
    };
  },
  mounted() {
    this.profileStore.loadUser({
      dtag: this.$route.params["dtag"].toLocaleString(),
      address: "",
    });
    this.parseLink(this.$route.params["link"].toLocaleString());
  },
  methods: {
    parseLink(linkRaw: string) {
      this.requestedLink = linkRaw.trim();
      if (this.requestedLink.length > 0) {
        if (supportedSocialNetworks.indexOf(this.requestedLink) > -1) {
          ref(this.profileStore);
          watchEffect(() => {
            if (this.profileStore.profile) {
              this.matchedLinks = [];
              // search for supported ApplicationLinks
              this.profileStore.profile.applicationLinks.forEach((appLink) => {
                if (appLink.name === this.requestedLink) {
                  this.matchedLinks.push(appLink);
                }
              });
              if (this.matchedLinks.length > 0) {
                // With only 1 link, automatic redirect
                if (this.matchedLinks.length === 1) {
                  window.setInterval(() => {
                    this.redirectTo(this.matchedLinks[0]);
                  }, 2000);
                }
              } else {
                //No Social Network matches
                this.redirectInvalidLink();
              }
            } else if (
              this.profileStore.profile === false &&
              this.profileStore.profileLoadingStatus !== 0
            ) {
              // Account does not exists
              this.redirectInvalidLink();
            }
          });
        } else {
          //Social not supported
          this.redirectInvalidLink();
        }
      }
    },
    redirectTo(appLink: ApplicationLink) {
      window.location.href = appLink.redirectUrl;
    },
    redirectInvalidLink() {
      this.requestedLink = "";
      this.$router.push(`/${this.$route.params["dtag"]}`);
    },
  },
});
</script>