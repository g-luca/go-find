import { defineComponent } from "vue";

import ApolloQuery from "vue-apollo"
import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";
import ProfileHeading from "@/modules/profile/components/ProfileHeading/ProfileHeading.vue";
import ProfileAppLinks from "@/modules/profile/components/ProfileAppLinks/ProfileAppLinks.vue";
import Error404 from "@/ui/components/errors/Error404.vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import UserModule from '@/store/modules/UserModule';
import { getModule } from 'vuex-module-decorators';
const userModule = getModule(UserModule);

export default defineComponent({

    components: {
        AppHeader,
        AppFooter,
        SkeletonLoader,
        Error404,
        ProfileHeading,
        ProfileAppLinks,
        ApolloQuery,
    }, beforeRouteUpdate(to, from, next) {
        userModule.loadUser(to.params['username'].toLocaleString());
        next()
    },
    mounted() {
        userModule.loadUser(this.$route.params['username'].toLocaleString());
    },
});