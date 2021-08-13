import { defineComponent } from "vue";

import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import ApplicationLink from "@/core/types/ApplicationLink";
import { getModule } from "vuex-module-decorators";
import UserModule from "@/store/modules/UserModule";
import { DesmosApplicationLinkState } from "desmosjs";
const userModule = getModule(UserModule);


export default defineComponent({

    components: {
        SkeletonLoader,
    }, computed: {
        validApplicationLinks: () => {
            if (userModule.user) {
                return userModule.user.applicationLinks.filter((applicationLink: ApplicationLink) => {
                    return (applicationLink.state.toLocaleString()) === 'APPLICATION_LINK_STATE_VERIFICATION_SUCCESS';
                });
            } else {
                return [];
            }
        }
    }, methods: {
        openApplicationLink(applicationLink: ApplicationLink): void {
            const url = encodeURI(`${applicationLink.url}${applicationLink.username}`);
            window.open(url, '_blank')
        }
    },
});