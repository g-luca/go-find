import RegisterModule from "@/store/modules/RegisterModule";
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const registerModule = getModule(RegisterModule)

export default defineComponent({
    data() {
        return {
        }
    },
    methods: {
    },
});