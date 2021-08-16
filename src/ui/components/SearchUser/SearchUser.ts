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
            searchDtag: "",
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
            const dtag = this.searchDtag.toString();
            const isDtagValid = DesmosJS.usernameRegex.test(dtag) || DesmosJS.addressRegex.test(dtag);
            this.showSearchResults = isDtagValid;
            if (isDtagValid) {
                searchUser.search(dtag);
            }
        },
        directSearch() {
            const dtag = this.searchDtag;
            const isDtagValid = DesmosJS.usernameRegex.test(dtag) || DesmosJS.addressRegex.test(dtag);
            if (isDtagValid) {
                router.push(`/${dtag}`);
            }
        },
        openProfile(dtag: string) {
            this.showSearchResults = false;
            router.push(`/${dtag}`);
        }
    }
});