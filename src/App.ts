import { useAuthStore } from './stores/AuthModule';
import { useThemeStore } from './stores/ThemeModule';
import { defineComponent } from "vue";
import loadFormValidators from "./utils/FormValidators";
import { useWalletStore } from './stores/WalletModule';

export default defineComponent({
    components: {},
    data() {
        return {};
    },
    async created() {
        // init operations
        useAuthStore().authenticate(); // check the authentication status by recovering auth data from the local storage
        useWalletStore().retrievCurrentWallet(); // try to reconnect to the current account wallet signer (Keplr/WalletConnect/etc) if still available
        useThemeStore().loadThemeConfiguration(); // load theme UI configuration
        loadFormValidators(); // load the vee-validate Form validators
    },
});