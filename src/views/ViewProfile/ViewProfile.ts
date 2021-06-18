import { defineComponent } from "vue";

import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import UserModule from '@/store/modules/UserModule';
import { getModule } from 'vuex-module-decorators';
const userModule = getModule(UserModule);
/* import LoginFormUser from "@/modules/login/components/LoginFormUser/LoginFormUser.vue"; */


export default defineComponent({

    components: {
        AppHeader,
        AppFooter,
        SkeletonLoader,
        /* LoginFormUser, */
    },
    data() {
        return {
        }
    },
    mounted() {
        const username = this.$route.params['username'].toLocaleString();
        userModule.loadUser(username);
    }, methods: {
    },
});