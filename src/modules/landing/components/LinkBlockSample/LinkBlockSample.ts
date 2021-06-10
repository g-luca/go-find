
import { defineComponent } from "vue";

const WORDS: string[] = ["instagram", "facebook", "yourlink", "twitch", "website"];

export default defineComponent({
    props: {
        username: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            wordIndex: 0,
            link: WORDS[0],
        }
    },
    mounted(): void {
        this.changeWords();
    }, methods: {
        nextWord() {
            (this.wordIndex < WORDS.length - 1) ? this.wordIndex++ : this.wordIndex = 0;
            this.link = WORDS[this.wordIndex];
        },
        async changeWords() {
            for (; ;) {
                await this.writeWord();
                await this.cancelWord();
            }
        },
        async cancelWord() {
            const wordLength = this.link.length;
            for (let i = 0; i < wordLength; i++) {
                await this.sleep(100);
                this.link = this.link.slice(0, this.link.length - 1);
            }
            await this.sleep(400);
            this.nextWord();
        },
        async writeWord() {
            const wordLength = this.link.length;
            const word = this.link;
            for (let i = 0; i < wordLength; i++) {
                this.link = word.slice(0, i + 1);
                await this.sleep(100);
            }
            await this.sleep(3000);
        },
        sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
});