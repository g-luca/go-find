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
            isValidEPassword: false,
            isEPasswordEqual: false,
            isTouched: false,
            inputUsername: "",
            inputEPassword: "",
            inputEPasswordConfirm: "",
        };
    },
    methods: {
        validateUsername() {
            this.isValidUsername = User.USERNAME_REGEX.test(this.inputUsername);
        },
        validatePassword() {
            this.isValidEPassword = User.PASSWORD_REGEX.test(this.inputEPassword);
        },
        validatePasswordConfirm() {
            this.isEPasswordEqual = this.isValidEPassword && this.inputEPassword === this.inputEPasswordConfirm;
        },
        setUserInfo() {
            this.isTouched = true;
            this.validateUsername();
            this.validatePassword();
            if (this.isValidUsername && this.isValidEPassword && this.isEPasswordEqual) {
                registerModule.setUsername(this.inputUsername);
                registerModule.setEPassword(this.inputEPassword);
                registerModule.nextState(RegisterState.StateMPasswordInput);
            }
        },
    },
});