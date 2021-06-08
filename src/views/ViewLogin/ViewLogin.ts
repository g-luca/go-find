
import { defineComponent } from "vue";

import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";
import LoginFormUser from "@/modules/login/components/LoginFormUser/LoginFormUser.vue";
import LoginFormMPassword from "@/modules/login/components/LoginFormMPassword/LoginFormMPassword.vue";

export default defineComponent({
    components: {
        AppHeader,
        AppFooter,
        LoginFormUser,
        LoginFormMPassword
    },
    data() {
        return {
        }
    }, methods: {
    },
});