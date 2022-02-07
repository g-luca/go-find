<template>
  <section>
    <section
      v-if="isVerifyingAppConnection"
      class="grid grid-cols-12 py-4"
    >
      <div class="text-center col-span-12">
        <img
          class="w-1/3 mx-auto py-4"
          src="@/assets/illustrations/register/loading_blockchain.svg"
          alt=""
        >
        <div class="text-2xl">
          Waiting for Band Oracle to verify your Discord link...
        </div>
        <div class="text-md font-thin">
          This operation can take up to 1 minute.
        </div>
      </div>
    </section>

    <!-- Discord Verify Connect -->
    <section
      v-if="!isVerifyingAppConnection"
      class="grid grid-cols-12 py-4"
    >
      <span
        v-if="isAppConnected"
        class="col-span-12 grid grid-cols-12"
      >
        <div class="col-span-12 md:col-span-1">
          <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 dark:bg-gray-700 text-brand select-none">
            3
          </span>
        </div>
        <div class="col-span-12 md:col-span-11 dark:text-white text-lg md:pl-8">
          <div class="col-span-2 py-2">
            <div class="dark:text-white text-xl font-bold">
              Complete your Desmos account verification
            </div>
            <div>
              Run the following command in the same <span class="font-light text-white bg-gray-700 px-2 rounded-md">#mainnet-verification</span> <a
                href="https://discord.desmos.network/"
                class="text-blue-500 underline"
                target="_blank"
              >Discord Channel</a>:
            </div>
            <div class="my-2 p-3 bg-gray-600 dark:bg-black rounded-xl text-sm">
              <div class="p-3 overflow-x-auto text-white font-mono">
                {{cmdVerify}}
              </div>
              <button
                type="button"
                class="px-4 py-1 text-sm font-light text-white hover:text-brand"
                @click="copy(cmdVerify)"
              >
                <i class="bi bi-clipboard cursor-pointer" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </span>
      <span
        v-else
        class="col-span-12"
      >
        <div class="text-center">
          <img
            class="w-1/3 mx-auto py-4"
            src="@/assets/illustrations/airdrop/claim_error.svg"
            alt=""
          >
          <span class="text-red-500 text-2xl">
            {{appConnectionError}}
          </span>
        </div>
      </span>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getModule } from "vuex-module-decorators";
import DesmosNetworkModule from "@/store/modules/DesmosNetworkModule";
import AuthModule from "@/store/modules/AuthModule";
import { ApplicationLinkQuery } from "@/gql/ApplicationLinkQuery";
import { useApolloClient } from "@vue/apollo-composable";
import AccountModule from "@/store/modules/AccountModule";
import { useClipboardStore } from "@/stores/ClipboardModule";
const desmosNetwork = getModule(DesmosNetworkModule);
const authModule = getModule(AuthModule);
const accountModule = getModule(AccountModule);

export default defineComponent({
  components: {},
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    const net = desmosNetwork.isTestnet ? "testnet" : "mainnet";
    const cmdVerify = `!verify ${net}`;
    return {
      cmdVerify,
      isVerifyingAppConnection: false,
      isAppConnected: false,
      appConnectionError: "",
    };
  },
  beforeMount() {
    this.waitApplicationLink();
  },
  methods: {
    copy(value: string) {
      useClipboardStore().copy(value);
    },
    async waitApplicationLink(): Promise<void> {
      this.isVerifyingAppConnection = true;
      do {
        const apollo = useApolloClient();
        try {
          const res = await apollo.client.query({
            query: ApplicationLinkQuery,
            fetchPolicy: "no-cache",
            variables: {
              dtag: authModule.account?.dtag,
              appName: "discord",
              appUsername: this.username,
            },
          });
          // check if the link has been created correctly
          if (res.data.profile[0].application_links.length > 0) {
            const appLink = res.data.profile[0].application_links[0];
            switch (appLink.state) {
              // success
              case "APPLICATION_LINK_STATE_VERIFICATION_SUCCESS":
                this.isAppConnected = true;
                this.isVerifyingAppConnection = false;
                if (accountModule.profile) {
                  accountModule.loadAccount(true);
                }
                break;
              case "APPLICATION_LINK_STATE_TIMED_OUT":
                this.isAppConnected = false;
                this.isVerifyingAppConnection = false;
                this.appConnectionError =
                  "Connection timed out, Delete the Social Link and try again";
                break;
              case "APPLICATION_LINK_STATE_VERIFICATION_ERROR":
                this.isAppConnected = false;
                this.isVerifyingAppConnection = false;
                this.appConnectionError =
                  "Connection failed. Delete the Social Link, and try again.";
                break;
              default:
                this.isAppConnected = false;
                this.isVerifyingAppConnection = true;
                break;
            }
          } else {
            // waiting
          }
        } catch (e) {
          console.log(e);
        }
        await this.sleep(5000);
      } while (this.isVerifyingAppConnection);
    },
    sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
});
</script>
