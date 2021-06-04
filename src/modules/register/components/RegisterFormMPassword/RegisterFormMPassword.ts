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
            isValidMPassword: false,
            isMPasswordEqual: false,
            isTouched: false,
            inputMPassword: "",
            inputMPasswordConfirm: "",
        };
    },
    methods: {
        validateMPassword() {
            this.isValidMPassword = (User.PASSWORD_REGEX.test(this.inputMPassword) && this.inputMPassword !== registerModule.mPassword);
        },
        validateMPasswordConfirm() {
            this.isMPasswordEqual = this.isValidMPassword && this.inputMPassword === this.inputMPasswordConfirm;
        },
        goBack(): void {
            registerModule.nextState(RegisterState.StateUserInput)
        },
        setMPassword() {
            this.isTouched = true;
            this.validateMPassword();
            if (this.isValidMPassword && this.isMPasswordEqual) {
                registerModule.setMPassword(this.inputMPassword);
                registerModule.nextState(RegisterState.StateWalletGeneration);
            }
        },
    },
});