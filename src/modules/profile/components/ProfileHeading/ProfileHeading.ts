import { defineComponent } from "vue";

import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";


export default defineComponent({

    components: {
        SkeletonLoader,
    },
    data() {
        return {
            canCopy: false,
        }
    },
    mounted() {
        // check if the browser is compatible with the clipboard API
        this.canCopy = !!navigator.clipboard;
    },
    methods: {
        copyAddress(address: string) {
            navigator.clipboard.writeText(address);
        }, getChainLogo(name: string) {
            try {
                return require('@/assets/brands/' + name + '/logo.svg')
            } catch (e) {
                return '';
            }
        }
    }
});