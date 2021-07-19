import { defineComponent } from "vue";
import ToggleTheme from '@/ui/components/ToggleTheme/ToggleTheme.vue'
import SearchUser from "../SearchUser/SearchUser.vue";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/AuthModule";
import router from "@/router";
const authModule = getModule(AuthModule);

export default defineComponent({
  components: {
    ToggleTheme, SearchUser,

    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
  },
  data() {
    return {
    }
  }, methods: {
    logout() {
      authModule.logout();
      router.push('/');
    }
  }
});