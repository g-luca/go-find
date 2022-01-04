import WalletConnectModule from '@/store/modules/WalletConnectModule';
import { getModule } from 'vuex-module-decorators';
import LinkBlockSample from '../LinkBlockSample/LinkBlockSample.vue';
const walletConnectModule = getModule(WalletConnectModule);


export default {
  components: { LinkBlockSample },
  data() {
    const squares: string[] = [
      "github", "facebook", "band", "discord",
      "bitcoin", "go-find", "desmos", "dogecoin",
      "cosmos", "twitter", "instagram", "ethereum",
      "twitch", "tiktok", "youtube", "osmosis",
      "crypto.org", "linkedin", "akash"];
    return {
      squares,
    }
  },
}
