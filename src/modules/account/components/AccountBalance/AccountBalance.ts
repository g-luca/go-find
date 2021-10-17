import { defineComponent } from "vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
export default defineComponent({
    components: {
        SkeletonLoader,
    },
    data() {
        return {
            coinDenom: `${process.env.VUE_APP_COIN_DENOM}`,
        }
    },
    methods: {
        splitNumberLeft(value: number, separator: string) {
            return String(value).split(separator)[0];
        },
        splitNumberRight(value: number, separator: string) {
            return String(value).split(separator)[1];
        }

    }
});