import RegisterModule, { RegisterState } from "@/store/modules/RegisterModule";
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
const registerModule = getModule(RegisterModule)

export default defineComponent({
    data() {
        return {
            hasWroteMnemonic: false
        }
    },
    mounted() {
        registerModule.generateBip();
    },
    methods: {
        downloadMnemonic(): void {
            const obj = { address: registerModule.address, mnemonic: registerModule.mnemonic };
            const json = JSON.stringify(obj);
            const file = "data:text/json;charset=utf-8," + encodeURIComponent(json);
            const filename = `${registerModule.dtag}-wallet.json`;
            const downloadElem = document.createElement('a');
            if (downloadElem != null) {
                downloadElem.setAttribute("href", file);
                downloadElem.setAttribute("download", filename);
                downloadElem.click();
            }
        },
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