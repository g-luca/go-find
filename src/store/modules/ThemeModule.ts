import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";

/**
 * Available themes
 */
enum Theme {
    Light = 'light',
    Dark = 'dark',
}

@Module({ store, name: 'ThemeModule', dynamic: true })
export default class ThemeModule extends VuexModule {
    public activeTheme: Theme = Theme.Light; // default theme


    /**
     * Switch the Theme from Dark to Light or viceversa.
     */
    @Mutation
    public toggleTheme(): void {
        (this.activeTheme === Theme.Dark) ? this.activeTheme = Theme.Light : this.activeTheme = Theme.Dark;
        ThemeModule.setActiveTheme(this.activeTheme);
    }


    /**
     * Load and set the current theme configuration from the localstorage
     */
    @Mutation
    public loadThemeConfiguration(): void {
        let savedTheme: Theme = localStorage.theme;
        if (savedTheme !== Theme.Dark && savedTheme !== Theme.Light) {
            savedTheme = this.activeTheme;
        }
        ThemeModule.setActiveTheme(savedTheme);
        this.activeTheme = savedTheme;
    }


    /**
     * Static - Updates the HTML classes and the localStorage to activate the new theme.
     * @param newTheme The new Theme to replace with.
     */
    private static setActiveTheme(newTheme: Theme): void {
        if (newTheme === Theme.Dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.theme = newTheme;
    }
}