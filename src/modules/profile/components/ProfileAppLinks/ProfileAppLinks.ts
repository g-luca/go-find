import { defineComponent } from "vue";

import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import ApplicationLink from "@/core/types/ApplicationLink";


export default defineComponent({

    components: {
        SkeletonLoader,
    }, methods: {
        openApplicationLink(applicationLink: ApplicationLink): void {
            const url = encodeURI(`${applicationLink.url}${applicationLink.username}`);
            window.open(url, '_blank')
        }
    }
});