import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
import AccountModule from "@/store/modules/AccountModule";
import AuthModule from "@/store/modules/AuthModule";
import ThemeModule from "./store/modules/ThemeModule";
import loadFormValidators from "./utils/FormValidators";
const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);
const themeModule = getModule(ThemeModule);

export default defineComponent({
    components: {},
    data() {
        return {};
    },
    async created() {
        // init operations
        authModule.authenticate(); // check auth status
        accountModule.loadAccount(); // if logged will load the account profile
        themeModule.loadThemeConfiguration();
        loadFormValidators(); // load the vee-validate Form validators
    },
});