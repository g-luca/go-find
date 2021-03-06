import { defineComponent } from "vue";
import SkeletonLoader from "@/ui/components/SkeletonLoader/SkeletonLoader.vue";
import AccountAirdrop from "@/modules/account/components/AccountAirdrop/AccountAirdrop.vue";
import AirdropModule from "@/store/modules/AirdropModule";
import ModalSend from "@/ui/components/ModalSend/ModalSend.vue";
import ModalStaking from "@/modules/account/components/AccountBalance/components/ModalStaking.vue";
import ModalGovernance from "@/modules/account/components/AccountBalance/components/ModalGovernance.vue";
import { getModule } from "vuex-module-decorators";

const airdropModule = getModule(AirdropModule);

export default defineComponent({
    components: {
        SkeletonLoader,
        AccountAirdrop,
        ModalSend,
        ModalStaking,
        ModalGovernance,
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