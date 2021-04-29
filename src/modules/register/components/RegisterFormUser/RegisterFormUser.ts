import User from "@/core/types/User";
import RegisterModule, { RegisterState } from "@/store/modules/RegisterModule";
import LinkBlockSample from "@/modules/landing/components/LinkBlockSample/LinkBlockSample.vue"
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
const registerModule = getModule(RegisterModule)

export default defineComponent({
    components: {
        LinkBlockSample
    },
    data() {
        return {
            isValidUsername: false,
            isValidPassword: false,
            isPasswordEqual: false,
            isTouched: false,
            inputUsername: "",
            inputPassword: "",
            inputPasswordConfirm: "",
        };
    },
    methods: {
        validateUsername() {
            this.isValidUsername = User.USERNAME_REGEX.test(this.inputUsername);
        },
        validatePassword() {
            this.isValidPassword = User.PASSWORD_REGEX.test(this.inputPassword);
        },
        validatePasswordConfirm() {
            this.isPasswordEqual = this.isValidPassword && this.inputPassword === this.inputPasswordConfirm;
        },
        setUserInfo() {
            this.isTouched = true;
            this.validateUsername();
            this.validatePassword();
            if (this.isValidUsername && this.isValidPassword && this.isPasswordEqual) {
                registerModule.setUsername(this.inputUsername);
                registerModule.setPassword(this.inputPassword);
                registerModule.nextState(RegisterState.StateWalletGeneration);
            }
        },
    },
});