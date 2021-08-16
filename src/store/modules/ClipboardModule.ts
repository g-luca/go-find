import store from '@/store';
import { Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({ store, name: 'ClipboardModule', dynamic: true })
export default class ClipboardModule extends VuexModule {
    public isVisible = false;
    public canCopy = !!navigator.clipboard;
    public valueToCopy = "";


    /**
     * Copy to the clipboard and show the alert
     * If the browser doesn't support the clipboard API, toggles a modal
     * @param value string value to copy
     */
    @Mutation
    public copy(value: string): void {
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
    }

    /**
     * Open the copy modal for unsupported browsers
     */
    @Mutation
    private close(): void {
        this.isVisible = false;
    }

}