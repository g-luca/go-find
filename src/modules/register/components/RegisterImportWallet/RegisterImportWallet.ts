import RegisterModule, { RegisterState } from "@/store/modules/RegisterModule";
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
import { validateMnemonic } from "bip39";
const registerModule = getModule(RegisterModule);

export default defineComponent({
    data() {
        return {
            isValidMnemonic: false,
            inputMnemonic: new Array<string>(24),
        }
    },
    methods: {
        goBack(): void {
            registerModule.nextState(RegisterState.StateWalletGeneration)
        },
        completeRegistration(): void {
            registerModule.completeRegistration();
            registerModule.nextState(RegisterState.StateRegistrationSuccess);
        },
        validateInputMnemonic(): void {
            this.inputMnemonic.forEach((word, i) => {
                this.inputMnemonic[i] = word.trim();
            });
            const mnemonic = this.inputMnemonic.join(' ');
            if (validateMnemonic(mnemonic)) {
                this.isValidMnemonic = true;
                registerModule.generateBip(mnemonic);
            } else {
                this.isValidMnemonic = false;
            }
        }
    },
});