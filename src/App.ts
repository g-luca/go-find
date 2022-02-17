import { useAuthStore } from './stores/AuthModule';
import { useAccountStore } from './stores/AccountModule';
import { useThemeStore } from './stores/ThemeModule';
import { defineComponent } from "vue";
import loadFormValidators from "./utils/FormValidators";

export default defineComponent({
    components: {},
    data() {
        return {};
    },
    async created() {
        // init operations
        useAuthStore().authenticate(); // check auth status
        useAccountStore().loadAccount(); // if logged will load the account profile
        useThemeStore().loadThemeConfiguration();
        loadFormValidators(); // load the vee-validate Form validators
    },
});