import { defineComponent } from "vue";

import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import ClipboardModule from "@/store/modules/ClipboardModule";
import { getModule } from "vuex-module-decorators";
const clipboardModule = getModule(ClipboardModule);

export default defineComponent({

    components: {
        SkeletonLoader,
    },
    methods: {
        copyAddress(value: string) {
            clipboardModule.copy(value);
        },
    }
});