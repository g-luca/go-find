import RegisterModule, { RegisterState } from "@/store/modules/RegisterModule";
import { defineComponent, ref } from "vue";
import { getModule } from "vuex-module-decorators";
import InputMnemonic from "@/ui/components/InputMnemonic.vue";
const registerModule = getModule(RegisterModule)

export default defineComponent({
    components: {
        InputMnemonic
    },
    data() {
        registerModule.generateWallet({ mnemonic: "", isNew: true });
        const mnemonic = registerModule.mnemonic.join(' ')
        return {
            hasWroteMnemonic: false,
            mnemonic: mnemonic,
        }
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