import User from "@/core/types/User";
import LinkBlockSample from "@/modules/landing/components/LinkBlockSample/LinkBlockSample.vue"
import AuthModule from "@/store/modules/AuthModule";
import LoginModule, { LoginState } from "@/store/modules/LoginModule";
import CryptoUtils from "@/utils/CryptoUtils";
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
const loginModule = getModule(LoginModule);
const authModule = getModule(AuthModule);

export default defineComponent({
    components: {
        LinkBlockSample
    },
    data() {
        return {
            isValidUsername: false,
            isValidEPassword: false,
            hasLoginError: false,
            isTouched: false,
            inputUsername: "",
            inputEPassword: "",
        };
    },
    methods: {
        validateUsername() {
            this.isValidUsername = User.USERNAME_REGEX.test(this.inputUsername);
        },
        validatePassword() {
            this.isValidEPassword = User.PASSWORD_REGEX.test(this.inputEPassword);
        },
        async signin() {
            this.isTouched = true;
            this.validateUsername();
            this.validatePassword();

            if (this.isValidEPassword && this.isValidUsername) {
                const ePassword = CryptoUtils.sha256(this.inputEPassword); // generate the hashed ePassword

                // Call the login endpoint, if username and ePassword matches it will return eKey, empty string otherwise
                await loginModule.login({ username: this.inputUsername, ePassword });
                const eKey = loginModule.eKey;
                if (eKey) {
                    loginModule.nextState(LoginState.StateMLogin);
                } else {
                    this.hasLoginError = true;
                }
            } else {
                this.hasLoginError = true;
            }
        },
    },
});