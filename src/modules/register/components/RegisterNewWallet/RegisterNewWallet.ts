import RegisterModule, { RegisterState } from "@/store/modules/RegisterModule";
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
import InputMnemonic from "@/ui/components/InputMnemonic.vue";
const registerModule = getModule(RegisterModule)

export default defineComponent({
    components: {
        InputMnemonic
    },
    data() {
        return {
            hasWroteMnemonic: false,
            mnemonic: "",
        }
    },
    mounted() {
        registerModule.generateWallet({ mnemonic: "", isNew: true });
        this.mnemonic = registerModule.mnemonic.join(' ')
    },
    methods: {
        wroteMnemonic(): void {
            this.hasWroteMnemonic = true;
        },
        goBack(): void {
            registerModule.nextState(RegisterState.StateMPasswordInput)
        },
        completeRegistration(): void {
            registerModule.completeRegistration();
        },
        goImportMnemonic() {
            registerModule.nextState(RegisterState.StateWalletImport);
        }
    },
});