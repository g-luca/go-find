
import { defineComponent } from "vue";

import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";
import RegisterFormUser from "@/modules/register/components/RegisterFormUser/RegisterFormUser.vue";
import RegisterNewWallet from "@/modules/register/components/RegisterNewWallet/RegisterNewWallet.vue";
import RegisterSuccess from "@/modules/register/components/RegisterSuccess/RegisterSuccess.vue";
import RegisterImportWallet from "@/modules/register/components/RegisterImportWallet/RegisterImportWallet.vue";
import RegisterFormMPassword from "@/modules/register/components/RegisterFormMPassword/RegisterFormMPassword.vue";
import RegisterFail from "@/modules/register/components/RegisterFail/RegisterFail.vue";
import RegisterResponseLoading from "@/modules/register/components/RegisterResponseLoading/RegisterResponseLoading.vue";

export default defineComponent({
    components: {
        AppHeader,
        AppFooter,
        RegisterFormUser,
        RegisterFormMPassword,
        RegisterNewWallet,
        RegisterSuccess,
        RegisterFail,
        RegisterImportWallet,
        RegisterResponseLoading
    },
    data() {
        return {
        }
    }, methods: {
    },
});