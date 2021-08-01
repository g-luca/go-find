import { defineComponent } from "vue";
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import { getModule } from "vuex-module-decorators";
import TransactionModule from "@/store/modules/TransactionModule";
const transactionModule = getModule(TransactionModule);

export default defineComponent({
    components: {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
    },
    data() {
        return {
            inputMPassword: '',
        };
    }, methods: {
        closeModal() {
            transactionModule.closeModal();
        },
        async sign() {
            await transactionModule.send({ mPassword: this.inputMPassword })
        }
    }
});