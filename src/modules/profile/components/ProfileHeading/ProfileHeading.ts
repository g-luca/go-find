import { defineComponent } from "vue";

import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import { useClipboardStore } from "@/stores/ClipboardModule";

export default defineComponent({

    components: {
        SkeletonLoader,
    },
    methods: {
        copyAddress(value: string) {
            useClipboardStore().copy(value);
        },
    }
});