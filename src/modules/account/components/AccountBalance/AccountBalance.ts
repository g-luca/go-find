import { defineComponent } from "vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import AccountAirdrop from "@/modules/account/components/AccountAirdrop/AccountAirdrop.vue";
import AirdropModule from "@/store/modules/AirdropModule";
import { getModule } from "vuex-module-decorators";

const airdropModule = getModule(AirdropModule);

export default defineComponent({
    components: {
        SkeletonLoader,
        AccountAirdrop,
    },
    data() {
        this.checkAirdrop()
        return {
            coinDenom: `${process.env.VUE_APP_COIN_DENOM}`,
            isAirdropActive: false,
        }
    },
    methods: {
        splitNumberLeft(value: number, separator: string) {
            return String(value).split(separator)[0];
        },
        splitNumberRight(value: number, separator: string) {
            return String(value).split(separator)[1];
        },
        toggleAirdropModal() {
            airdropModule.toggleAirdropModal();
            airdropModule.checkAirdrop();
        },
        async checkAirdrop() {
            await airdropModule.loadAirdropConfig();
        }

    }
});