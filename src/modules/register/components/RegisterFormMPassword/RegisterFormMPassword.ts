import User from "@/core/types/User";
import RegisterModule, { RegisterState } from "@/store/modules/RegisterModule";
import LinkBlockSample from "@/modules/landing/components/LinkBlockSample/LinkBlockSample.vue"
import { defineComponent } from "vue";
import { Form, Field } from "vee-validate";
import { getModule } from "vuex-module-decorators";
const registerModule = getModule(RegisterModule)

export default defineComponent({
    components: {
        LinkBlockSample,
        Form,
        Field
    },
    data() {
        const formSchema = {
            mPassword: { required: true, regex: User.PASSWORD_REGEX },
            mPasswordConfirm: { required: true, regex: User.PASSWORD_REGEX, confirmed: "@mPassword" },
        };
        return {
            formSchema,
            isValidMPassword: true,
            inputMPassword: "",
            inputMPasswordConfirm: "",
        };
    },
    methods: {
        validateMPassword() {
            this.isValidMPassword = this.inputMPassword !== registerModule.ePassword;
        },
        goBack(): void {
            registerModule.nextState(RegisterState.StateUserInput)
        },
        setMPassword() {
            registerModule.setMPassword(this.inputMPassword);
            if (registerModule.hasDesmosProfile) {
                registerModule.nextState(RegisterState.StateWalletImport);
            } else {
                registerModule.nextState(RegisterState.StateWalletGeneration);
            }
        },
    },
});