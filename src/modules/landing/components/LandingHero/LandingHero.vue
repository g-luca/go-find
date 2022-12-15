<template>
  <div class="dark:bg-denim-900 bg-royalblue-50 overflow-x-hidden">
    <section>
      <div class="relative min-h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden">
        <div class="grid grid-cols-7">
          <div class="w-screen xl:w-auto xl:col-span-3 z-10">
            <div class="text-center text-white pl-1 text-transparent bg-clip-text bg-gradient-to-br  from-purple-600 via-red-500  to-brand lg:py-20">
              <h1 class="text-5xl md:text-7xl xl:text-8xl font-bold">Connecting <br> Networks.</h1>
              <h2 class="leading-none font-medium text-4xl md:text-5xl py-12 mb-10">
                <span class="text-royalblue-900 dark:text-white">
                  One profile
                </span>for everything.
              </h2>
              <button
                type="button"
                class="py-4 my-4 px-6 text-white w-2/3 md:w-1/2 rounded-xl bg-gradient-to-r from-blue-400 via-teal-400 to-green-500 hover:from-green-600 text-xl font-bold uppercase"
                @click="$router.push('register')"
              >
                Get started
              </button>
              <div>
                <a
                  href="#"
                  class="text-black dark:text-white font-semibold"
                  @click="$router.push('login')"
                >Already have an account? <span class="underline">Sign In</span></a>
              </div>

              <div class="grid grid-cols-8 pt-3">
                <div
                  v-if="desmosNetworkStore.isTestnet"
                  class="col-span-8 sm:col-span-3 sm:col-start-2 text-right px-2 pt-3"
                >
                  <button
                    type="button"
                    class="w-full rounded-xl bg-gradient-to-br from-royalblue-400 to-blue-700 hover:bg-gradient-to-tl"
                    @click="$router.push('/login/walletconnect')"
                  >
                    <div class="flex py-2 justify-center">
                      <img
                        class="h-8"
                        src="/assets/brands/walletconnect/logo.svg"
                        alt=""
                      >
                      <span class="text-white pl-3 text-lg my-auto">
                        Use WalletConnect
                      </span>
                    </div>
                  </button>
                </div>

                <div
                  class="px-2 pt-3"
                  :class="[!desmosNetworkStore.isTestnet?'col-span-8 sm:col-span-8 text-center w-1/2 mx-auto':'col-span-8 sm:col-span-3 text-left']"
                >
                  <button
                    type="button"
                    class="w-full rounded-xl bg-gradient-to-br from-blue-400 to-violet-700 hover:bg-gradient-to-tl"
                    @click="$router.push('/login/keplr')"
                  >
                    <div class="flex py-2 justify-center">
                      <img
                        class="h-8"
                        src="/assets/brands/keplr/logo.svg"
                        alt=""
                      >
                      <span class="text-white pl-3  text-xl font-bold uppercase my-auto">
                        USE KEPLR
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute xl:relative xl:col-span-4 -mt-40 pl-5 md:pl-0 md:ml-20 blur-md xl:blur-none">
            <div class="grid-background m-2 ml-6 grid grid-cols-12 transform opacity-40 xl:opacity-75 -skew-y-12 scale-125">
              <div
                v-for="(name ,index) in squares"
                :class="{'col-span-4 md:col-span-3':index%3==0, 'md:col-span-2 ':index%2==1}"
                class="col-span-4 bg-gradient-to-br from-purple-200 dark:to-purple-400 rounded-3xl md:py-4 mx-4 my-3 hover:bg-gradient-to-tl shadow-lg"
              >
                <img
                  class="mx-auto w-32 h-32 p-4  select-none pointer-events-none"
                  :src="'/assets/brands/'+name+'/logo.svg'"
                  alt=""
                >
              </div>
            </div>
          </div>
        </div>
        <!-- grid background -->
      </div>
    </section>

    <!-- Decentralize -->
    <section>
      <div class="bg-white dark:bg-black text-royalblue-900 dark:text-white flex relative z-20 items-center overflow-hidden py-10">
        <div class="container mx-auto px-6 flex relative py-16 grid grid-cols-12">
          <div class="col-span-12 text-center">
            <div class="w-20 h-2 bg-brand mb-12 mx-auto" />
            <h1 class="uppercase text-4xl md:text-8xl font-black flex flex-col leading-none">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-700">decentralize</span>
              your socials
            </h1>
            <p class="text-2xl text-gray-500 dark:text-gray-500">
              Where the Blockchain makes the difference
            </p>
          </div>
          <div class="pt-20 col-span-12 grid grid-cols-12">
            <div class="col-span-12 md:col-span-4 pt-10 my-auto pointer-events-none">
              <img src="/assets/illustrations/landing/landing-social-box.svg">
            </div>
            <div class="col-span-12 md:col-span-7 md:col-start-6">
              <div class="">
                <h1 class="text-6xl text-center ">
                  <span class="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-indigo-700">Connect</span>
                  and
                  <span class="text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-700">Verify</span>
                </h1>
                <p class=" text-2xl text-center pt-5">
                  All the connected Social Networks are verified through a complex cryptographic Blockchain mechanism by Desmos.<br>
                  In this way we can ensure the ownership of the connected accounts.
                </p>
              </div>
              <div class="pt-20">
                <h1 class="text-6xl text-center ">
                  <span class="text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-pink-700">Explore</span>
                </h1>
                <p class="text-2xl text-center pt-5">
                  Make yourself easier to find. <br>
                  Once you connect a Social Network, everyone will find you with that username as well.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blockchains -->
    <section>
      <div class="bg-white dark:bg-black text-royalblue-900 dark:text-white flex relative z-20 items-center overflow-hidden py-10">
        <div class="container mx-auto px-6 flex relative py-16 grid grid-cols-12">
          <div class="col-span-12 md:col-span-8 xl:col-span-7">
            <div class="w-20 h-2 bg-brand mb-12" />
            <h1 class="uppercase text-5xl sm:text-8xl font-black flex flex-col leading-none">
              <span class="text-transparent bg-clip-text bg-gradient-to-br from-orchid-400 to-orchid-700"> Associate </span>
              your chains
            </h1>
            <p class="text-2xl text-gray-500 dark:text-gray-300 pt-5">
              Associate any Blockchain with your profile. <br> Let people know who you are in the Blockchain universe.
            </p>
          </div>
          <div class="col-span-12 md:col-span-4 xl:col-span-5 my-auto">
            <img src="/assets/illustrations/landing/landing-universe.svg">
          </div>
        </div>
      </div>
    </section>

    <!-- Link -->
    <section>
      <div class="bg-white dark:bg-black text-royalblue-900 dark:text-white flex relative z-20 items-center overflow-hidden py-10">
        <div class="container mx-auto px-6 flex relative py-16 grid grid-cols-12">
          <div class="col-span-12 md:col-span-4 xl:col-span-5 my-auto">
            <img src="/assets/illustrations/landing/landing-link.svg">
          </div>
          <div class="col-span-12 md:col-span-8 xl:col-span-7 text-right">
            <div class="w-20 h-2 bg-brand mb-12 ml-auto mr-0" />
            <h1 class="uppercase text-6xl sm:text-8xl font-black flex flex-col leading-none">
              <span class="text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-red-500 to-red-700"> only one </span>
              link
            </h1>
            <p class="text-2xl text-gray-500 dark:text-gray-300 pt-5">
              Stop using complex and different links, start sharing your connected Social profiles with easy to remember links.
            </p>
            <div class="mt-8 grid grid-cols-12">
              <LinkBlockSample
                class="w-full col-span-12 md:col-span-9 md:col-start-4"
                :username="'user'"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="faq">
      <div class="bg-white dark:bg-black text-royalblue-900 dark:text-white flex relative z-20 items-center overflow-hidden py-10">
        <div class="container mx-auto px-6 flex relative py-16 grid grid-cols-12 gap-x-10 gap-4">
          <div class="col-span-12 text-center">
            <div class="w-20 h-2 bg-brand mb-12 mx-auto " />
            <h1 class="uppercase text-6xl sm:text-8xl font-black flex flex-col leading-none">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-700 to-purple-800"> FAQs </span>
            </h1>
          </div>

          <!-- Price -->
          <div class="col-span-12 md:col-span-6 pt-10">
            <h6 class="text-xl md:text-4xl font-medium leading-6">
              <i class="bi bi-credit-card-fill rounded-xl bg-purple-700 text-white dark:text-black px-2 pt-1" />
              Is it Free?
            </h6>
            <div class="text-md md:text-xl leading-6 text-gray-500 dark:text-gray-400 mt-3">
              The platform itself is completely free as it is Open Source.
              However, in order to carry out any operation on the profile, such as modifying the biography, or connecting a social network,
              it is necessary to have DSM in order to pay the transaction fees within the blockchain.
            </div>
          </div>

          <!-- unsupported social or chain  -->
          <div class="col-span-12 md:col-span-6 pt-10">
            <h6 class="text-xl md:text-4xl font-medium leading-6">
              <i class="bi bi-hdd-network-fill rounded-xl bg-purple-700 text-white dark:text-black px-2 pt-1" />
              Unsupported Social/Blockchain
            </h6>
            <p class="text-md md:text-xl leading-6 text-gray-500 dark:text-gray-400 mt-3">
              For unsupported Blockchains you can open an issue on Github to have it added, it won't take long.
              Social Networks on the other hand, need to be supported by the Desmos Blockchain itself, which may take much longer.
            </p>
          </div>

          <!-- Why registration with the mnemonic  -->
          <div class="col-span-12 md:col-span-6 pt-10">
            <h6 class="text-xl md:text-4xl font-medium leading-6">
              <i class="bi bi-shield-lock-fill rounded-xl bg-purple-700 text-white dark:text-black px-2 pt-1" />
              Why is mnemonic input required?
            </h6>
            <div class="text-md md:text-xl leading-6 text-gray-500 dark:text-gray-400 mt-3">
              To ensure easy access to the platform, the input of the mnemonic is required during the registration procedure in order to derive the private key for sign transactions.
              This will be encrypted with the two passwords provided, and will be kept safe.
              <div class="mt-2">
                <span class="rounded-xl bg-gradient-to-br from-pink-200 to-blue-200 text-gray-500 dark:text-gray-700 px-2 py-0.5">Coming Soon</span> Direct access without registration via Ledger devices, Keplr wallet, Desmos Profile Manager App.
              </div>
            </div>
          </div>

          <!-- Mnemonic lost -->
          <div class="col-span-12 md:col-span-6 pt-10">
            <h6 class="text-xl md:text-4xl font-medium leading-6">
              <i class="bi bi-key-fill rounded-xl bg-purple-700 text-white dark:text-black px-2 pt-1" />
              I lost my password/mnemonic
            </h6>
            <div class="text-md md:text-xl leading-6 text-gray-500 dark:text-gray-400 mt-3">
              If you lose your password, you can always use the recovery procedure via mnemonic.<br>
              Otherwise the mnemonic is the only key that guarantees access to your address and account. If you lose it, there is nothing you can do, your account will be completely lost.
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="bg-white dark:bg-black text-royalblue-900 dark:text-white pt-10">
        <div class="text-center w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 z-20">
          <h2 class="font-extrabold">
            <div class="md:text-8xl text-4xl uppercase">
              Decentralize the internet
            </div>
            <div class="md:text-6xl text-3xl text-indigo-500 uppercase">
              It&#x27;s now or never.
            </div>
          </h2>
          <div class="pt-10">
            <img
              src="/assets/illustrations/landing/landing-connected-world.svg"
              class="mx-auto max-h-72"
            >
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white dark:bg-black text-royalblue-900 dark:text-white py-16">
      <div class="container mx-auto sm:flex-row flex-col flex text-center">
        <div class="sm:w-1/2 w-full py-4">
          <img
            src="/assets/brands/github/logo.svg"
            fillColor="yellow"
            class="w-24 h-24 mx-auto mb-2"
          >
          <a
            class="italic hover:underline cursor-pointer text-center mt-3 font-semibold text-2xl"
            href="https://github.com/g-luca/go-find"
            target="_blank"
          >Open Source</a>
          <p class="italic text-gray-500 dark:text-gray-500 text-center mb-3 mt-1">
            All the code is public, no secrets.<br>Open to anyone.
          </p>
        </div>

        <div class="sm:w-1/2 w-full py-4">
          <img
            src="/assets/brands/desmos/logo.svg"
            class="w-24 h-24 mx-auto mb-2"
          >
          <a
            class="italic hover:underline cursor-pointer text-center mt-3 font-semibold text-2xl"
            href="https://desmos.network"
            target="_blank"
          >Powered by Desmos</a>
          <p class="italic text-gray-500 dark:text-gray-500 text-center mb-3 mt-1">
            The Social Networks Blockchain.<br>Trusted, Secure, Privacy
            first.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import LinkBlockSample from "../LinkBlockSample/LinkBlockSample.vue";
import { useDesmosNetworkStore } from "@/stores/DesmosNetworkModule";
import { defineComponent } from "vue";

export default defineComponent({
  components: { LinkBlockSample },
  data() {
    const squares: string[] = [
      "github",
      "facebook",
      "band",
      "discord",
      "bitcoin",
      "go-find",
      "desmos",
      "dogecoin",
      "cosmos",
      "twitter",
      "instagram",
      "ethereum",
      "twitch",
      "tiktok",
      "youtube",
      "osmosis",
      "crypto.org",
      "linkedin",
      "akash",
    ];
    return {
      desmosNetworkStore: useDesmosNetworkStore(),
      squares,
    };
  },
});
</script>