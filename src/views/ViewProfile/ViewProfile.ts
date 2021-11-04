import { defineComponent, ref, watchEffect } from "vue";

import ApolloQuery from "vue-apollo"
import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";
import Clipboard from '@/ui/components/Clipboard.vue';
import ProfileHeading from "@/modules/profile/components/ProfileHeading/ProfileHeading.vue";
import ProfileAppLinks from "@/modules/profile/components/ProfileAppLinks/ProfileAppLinks.vue";
import Error404 from "@/ui/components/errors/Error404.vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import ProfileModule from '@/store/modules/ProfileModule';
import { getModule } from 'vuex-module-decorators';
import { supportedSocialNetworks } from "@/core/types/SupportedSocialNetworks";
import ApplicationLink from "@/core/types/ApplicationLink";
import { LoadingStatus } from "@/core/types/LoadingStatus";
const profileModule = getModule(ProfileModule);

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
        if (to.params['dtag'] !== from.params['dtag']) {
            profileModule.loadUser({ dtag: to.params['dtag'].toLocaleString(), address: "" });
            this.parseLink(to.params['link'].toLocaleString());
        }
        next()
    },
    data() {
        const link = "";
        return {
            link,
        }
    },
    mounted() {
        profileModule.loadUser({ dtag: this.$route.params['dtag'].toLocaleString(), address: "" });
        this.parseLink(this.$route.params['link'].toLocaleString());
    },
    methods: {
        parseLink(linkRaw: string) {
            this.link = linkRaw.trim();
            if (this.link.length > 0) {
                if (supportedSocialNetworks.indexOf(this.link) > -1) {
                    ref(profileModule);
                    watchEffect(() => {
                        if (profileModule.profile) {
                            const matches: ApplicationLink[] = [];
                            // search for supported ApplicationLinks
                            profileModule.profile.applicationLinks.forEach((appLink) => {
                                if (appLink.name === this.link) {
                                    matches.push(appLink);
                                }
                            });
                            if (matches.length > 0) {
                                //TODO: add UI support for multiple links to same app
                                window.setInterval(() => {
                                    window.location.href = `${matches[0].url}${matches[0].username}`
                                }, 2000);
                            } else {
                                //No Social Network matches
                                this.redirectInvalidLink();
                            }
                        } else if (profileModule.profile === false && profileModule.profileLoadingStatus !== 0) {
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
        redirectInvalidLink() {
            this.link = "";
            this.$router.push(`/${this.$route.params['dtag']}`);
        }
    },
});