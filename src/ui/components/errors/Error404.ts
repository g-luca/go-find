import { defineComponent } from "vue";

export default defineComponent({
    props: {
        message: {
            type: String,
            required: true
        }
    },
});