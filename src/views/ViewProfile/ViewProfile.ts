import { defineComponent } from "vue";

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
    }, beforeRouteUpdate(to, from, next) {
        profileModule.loadUser(to.params['dtag'].toLocaleString());
        next()
    },
    mounted() {
        profileModule.loadUser(this.$route.params['dtag'].toLocaleString());
    },
});