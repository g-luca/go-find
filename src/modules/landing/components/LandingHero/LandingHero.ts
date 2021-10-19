import WalletConnectModule from '@/store/modules/WalletConnectModule';
import { getModule } from 'vuex-module-decorators';
import LinkBlockSample from '../LinkBlockSample/LinkBlockSample.vue';
const walletConnectModule = getModule(WalletConnectModule);


export default {
  components: { LinkBlockSample },
  data() {
    const squares: string[] = [
      "github", "twitter", "band", "discord",
      "bitcoin", "go-find", "desmos", "dogecoin",
      "akash", "twitch", "instagram", "ethereum",
      "facebook", "tiktok", "youtube", "osmosis",
      "crypto", "linkedin", "cosmos"];
    return {
      squares,
    }
  },
  methods: {
    openWalletConnect(): void {
      walletConnectModule.connect();
    }
  }
}
