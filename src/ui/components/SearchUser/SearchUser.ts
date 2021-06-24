import Api from "@/core/api/Api";
import User from "@/core/types/User";
import router from "@/router";
import SearchModule from "@/store/modules/SearchModule";
import { DesmosJS } from "desmosjs";
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
const searchUser = getModule(SearchModule);

export default defineComponent({
    components: {},
    data() {
        return {
            searchUsername: "",
            showSearchResults: false,
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
            const username = this.searchUsername.toString();
            const isUsernameValid = DesmosJS.usernameRegex.test(username) || DesmosJS.addressRegex.test(username);
            this.showSearchResults = isUsernameValid;
            if (isUsernameValid) {
                searchUser.search(username);
            }
        },
        directSearch() {
            const username = this.searchUsername;
            const isUsernameValid = DesmosJS.usernameRegex.test(username) || DesmosJS.addressRegex.test(username);
            if (isUsernameValid) {
                router.push(`/${username}`);
            }
        },
        openProfile(username: string) {
            this.showSearchResults = false;
            router.push(`/${username}`);
        }
    }
});