import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';

/**
 * Available themes
 */
enum Theme {
    Light = 'light',
    Dark = 'dark',
}


export const useThemeStore = defineStore({
    id: 'ThemeStore',
    state: () => ({
        activeTheme: Theme.Light // default theme
    }),
    getters: {
    },
    actions: {
        /**
         * Switch the Theme from Dark to Light or viceversa.
         */
        toggleTheme(): void {
            (this.activeTheme === Theme.Dark) ? this.activeTheme = Theme.Light : this.activeTheme = Theme.Dark;
            setActiveTheme(this.activeTheme);
        },

        /**
         * Load and set the current theme configuration from the localstorage
         */
        loadThemeConfiguration(): void {
            let savedTheme: Theme = localStorage.theme;
            if (savedTheme !== Theme.Dark && savedTheme !== Theme.Light) {
                savedTheme = this.activeTheme;
            }
            setActiveTheme(savedTheme);
            this.activeTheme = savedTheme;
        },
    },
})



/**
 * Updates the HTML classes and the localStorage to activate the new theme.
 * @param newTheme The new Theme to replace with.
 */
function setActiveTheme(newTheme: Theme): void {
    if (newTheme === Theme.Dark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark')
    }
    localStorage.theme = newTheme;
}

// Register the store to enable HMR
registerModuleHMR(useThemeStore);