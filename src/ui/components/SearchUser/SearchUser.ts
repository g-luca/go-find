import router from "@/router";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DesmosJS = require("desmosjs/dist/lib/DesmosJS.js");
import { defineComponent } from "vue";

export default defineComponent({
    components: {},
    data() {
        return {
            searchUsername: ""
        }
    },
    mounted() {
        window.addEventListener('keydown', (e) => {
            if (e.metaKey && e.key == 'k') {
                try {
                    (this.$refs.searchInput as HTMLFontElement).focus()
                    // eslint-disable-next-line no-empty
                } catch (e) { }
            }
        });
    }, methods: {
        search() {
            const username = this.searchUsername;
            if (DesmosJS.DesmosJS.usernameRegex.test(username) || DesmosJS.DesmosJS.addressRegex.test(username)) {
                router.push(`/${username}`);
            }
        }
    }
});