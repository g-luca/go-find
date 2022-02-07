import { defineStore } from 'pinia'
import { registerModuleHMR } from '.';


export const useClipboardStore = defineStore({
    id: 'ClipboardStore',
    state: () => ({
        isVisible: false,
        canCopy: !!navigator.clipboard,
        valueToCopy: "",
    }),
    getters: {
    },
    actions: {

        /**
         * Copy to the clipboard and show the alert
         * If the browser doesn't support the clipboard API, toggles a modal
         * @param value string value to copy
         */
        copy(value: string): void {
            this.valueToCopy = value;
            if (this.canCopy) {
                navigator.clipboard.writeText(value);
                this.isVisible = true;
                window.setTimeout(() => {
                    this.isVisible = false;
                }, 1000);
            } else {
                this.isVisible = true;
            }
        },

        /**
         * Open the copy modal for unsupported browsers
         */
        close(): void {
            this.isVisible = false;
        }
    },
})

// Register the store to enable HMR
registerModuleHMR(useClipboardStore);