import { defineComponent } from "vue";

import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import ApplicationLink from "@/core/types/ApplicationLink";
import { getModule } from "vuex-module-decorators";
import ProfileModule from "@/store/modules/ProfileModule";
const profileModule = getModule(ProfileModule);


export default defineComponent({

    components: {
        SkeletonLoader,
    }, computed: {
        validApplicationLinks: () => {
            if (profileModule.profile) {
                return profileModule.profile.applicationLinks.filter((applicationLink: ApplicationLink) => {
                    return (applicationLink.state.toLocaleString()) === 'APPLICATION_LINK_STATE_VERIFICATION_SUCCESS';
                });
            } else {
                return [];
            }
        }
    }, methods: {
        openApplicationLink(applicationLink: ApplicationLink): void {
            let url = encodeURI(`${applicationLink.url}${applicationLink.username}`);
            if (applicationLink.name === 'domain') {
                url = encodeURI(`https://${applicationLink.username}`);
            }
            window.open(url, '_blank')
        }
    },
});