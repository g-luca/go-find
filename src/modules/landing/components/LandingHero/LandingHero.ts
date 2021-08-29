import LinkBlockSample from '../LinkBlockSample/LinkBlockSample.vue'


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
}
