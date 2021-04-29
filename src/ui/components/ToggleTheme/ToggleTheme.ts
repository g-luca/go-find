import ThemeModule from "@/store/modules/ThemeModule";
import { Vue } from "vue-class-component";
import { getModule } from "vuex-module-decorators";
const themeModule = getModule(ThemeModule)


export default class ToggleTheme extends Vue {
    mounted(): void {
        themeModule.loadThemeConfiguration();
    }

    public toggleTheme(): void {
        themeModule.toggleTheme();
    }




};