import RegisterModule from "@/store/modules/RegisterModule";
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
const registerModule = getModule(RegisterModule)

export default defineComponent({
    data() {
        return {
        }
    },
    methods: {
        reset(): void {
            registerModule.reset();
        }
    },
});