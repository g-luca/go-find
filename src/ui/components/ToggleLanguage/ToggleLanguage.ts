import { ref } from "vue";
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    RadioGroup,
    RadioGroupLabel,
    RadioGroupOption,
} from "@headlessui/vue";


class Lang {
    name = "";
    isSelected = false;

    constructor(_name: string, _isSelected = false) {
        this.name = _name;
        this.isSelected = _isSelected
    }
}

export default {
    components: {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        RadioGroupOption,
        RadioGroup,
        RadioGroupLabel,
        DialogTitle,
    },

    setup(): Record<string, unknown> {
        const isOpen = ref(false);
        const language = ref("startup");
        const langs: Lang[] = [new Lang("English", true)];

        return {
            isOpen,
            closeModal() {
                isOpen.value = false;
            },
            openModal() {
                isOpen.value = true;
            },
            language,
            langs,
        };
    },
};