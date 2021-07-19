import ThemeModule from "@/store/modules/ThemeModule";
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
const themeModule = getModule(ThemeModule)



export default defineComponent({
    props: {
        active: Boolean
    },
    mounted(): void {
        themeModule.loadThemeConfiguration();
    }, methods: {
        toggleTheme(): void {
            console.log('toggle theme')
            themeModule.toggleTheme();
        }

    }
});