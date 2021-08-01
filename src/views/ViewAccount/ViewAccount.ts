import { defineComponent } from "vue";
import AppFooter from "@/ui/components/AppFooter/AppFooter.vue";
import AppHeader from "@/ui/components/AppHeader/AppHeader.vue";

import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import { getModule } from 'vuex-module-decorators';
import AuthModule from "@/store/modules/AuthModule";
import Error404 from "@/ui/components/errors/Error404.vue";
import ModalTransaction from "@/ui/components/ModalTransaction/ModalTransaction.vue";
import AccountBalance from "@/modules/account/components/AccountBalance/AccountBalance.vue";
import AccountChainLinks from "@/modules/account/components/AccountChainLinks/AccountChainLinks.vue";
import AccountModule from "@/store/modules/AccountModule";
import AccountProfileEdit from "@/modules/account/components/AccountProfileEdit/AccountProfileEdit.vue";
const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);

export default defineComponent({
    components: {
        AppHeader,
        AppFooter,
        SkeletonLoader,
        Error404,
        ModalTransaction,
        AccountBalance,
        AccountChainLinks,
        AccountProfileEdit,
    },
    async mounted() {
        const account = authModule.account;
        if (account) {
            await accountModule.loadAccount();
        }
    },
});