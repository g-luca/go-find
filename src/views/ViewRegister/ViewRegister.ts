
import store from '@/store'
import { defineComponent } from "vue";

import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";
import RegisterFormUser from "@/modules/register/components/RegisterFormUser/RegisterFormUser.vue";
import RegisterNewWallet from "@/modules/register/components/RegisterNewWallet/RegisterNewWallet.vue";
import RegisterSuccess from "@/modules/register/components/RegisterSuccess/RegisterSuccess.vue";

export default defineComponent({
    components: {
        AppHeader,
        AppFooter,
        RegisterFormUser,
        RegisterNewWallet,
        RegisterSuccess,
    },
    data() {
        return {
        }
    }, methods: {
    },
});