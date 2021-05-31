import { defineComponent } from "vue";
import store from '@/store'
import ToggleTheme from '@/ui/components/ToggleTheme/ToggleTheme.vue'
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/AuthModule";

const authModule = getModule(AuthModule)

export default defineComponent({
  components: { ToggleTheme },
  data() {
    return {
      username: authModule.account?.username,
    }
  },
});