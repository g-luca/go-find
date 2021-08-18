import RegisterModule, { RegisterState } from "@/store/modules/RegisterModule";
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
import InputMnemonic from "@/ui/components/InputMnemonic.vue";

const registerModule = getModule(RegisterModule);

export default defineComponent({
    components: {
        InputMnemonic,
    },
    data() {
        return {
            isValidMnemonic: false,
        }
    },
    methods: {
        goBack(): void {
            registerModule.nextState(RegisterState.StateWalletGeneration)
        },
        completeRegistration(): void {
            registerModule.completeRegistration();
        },
        onMnemonic(mnemonic: string): void {
            if (mnemonic) {
                this.isValidMnemonic = true;
                registerModule.generateWallet({ mnemonic: mnemonic, isNew: false });
            } else {
                this.isValidMnemonic = false;
            }
        }
    },
});