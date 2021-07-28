import { defineComponent } from "vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
export default defineComponent({
    components: {
        SkeletonLoader,
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