import { useThemeStore } from './stores/ThemeModule';
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
import AccountModule from "@/store/modules/AccountModule";
import AuthModule from "@/store/modules/AuthModule";
import loadFormValidators from "./utils/FormValidators";
const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);

export default defineComponent({
    components: {},
    data() {
        return {};
    },
    async created() {
        // init operations
        authModule.authenticate(); // check auth status
        accountModule.loadAccount(); // if logged will load the account profile
        useThemeStore().loadThemeConfiguration();
        loadFormValidators(); // load the vee-validate Form validators
    },
});