<template>
  <section>
    <!-- Discord Command -->
    <section class="grid grid-cols-12 py-4">
      <div class="col-span-12 md:col-span-1">
        <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 dark:bg-gray-700 text-brand select-none">
          1
        </span>
      </div>
      <div class="col-span-12 md:col-span-11 dark:text-white text-xl font-bold md:pl-8 md:pl-8">
        Type the following command in the <span class="font-light text-white bg-gray-700 px-2 rounded-md">#mainnet-verification</span> <a
          href="https://discord.desmos.network/"
          class="text-blue-500 underline"
          target="_blank"
        >Discord Channel</a>:

        <div class="my-2 p-3 bg-gray-600 dark:bg-black rounded-xl text-sm">
          <div class="p-3 overflow-x-auto text-white font-mono">
            {{ cmdConnect }}
          </div>
          <button
            type="button"
            class="px-4 py-1 text-sm font-light text-white hover:text-brand"
            @click="copy(cmdConnect)"
          >
            <i class="bi bi-clipboard cursor-pointer" />
            Copy
          </button>
        </div>
      </div>
    </section>

    <!-- Discord Verify Connect -->
    <section class="grid grid-cols-12 py-4">
      <div class="col-span-12 md:col-span-1">
        <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 dark:bg-gray-700 text-brand select-none">
          2
        </span>
      </div>
      <div class="col-span-12 md:col-span-11 dark:text-white text-lg md:pl-8">
        <div class="col-span-2 py-2">
          <div class="dark:text-white text-xl font-bold">
            Connect your Discord account
          </div>
          <button
            type="button"
            :disabled="isVerifyingConnect"
            class="py-2 w-1/4 bg-purple-600 hover:bg-purple-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            :class="{'grayscale cursor-wait':isVerifyingConnect}"
            @click="submitApplicationLink()"
          >
            <span v-if="isVerifyingConnect">
              Connecting...
            </span>
            <span v-else>
              Connect
            </span>
          </button>

          <span
            v-if="hasConnected"
            class="text-green-500 pl-6"
          >
            <i class="bi bi-check-circle" />
            Connected
          </span>
          <span
            v-else
            class="text-red-700 pl-6"
          >
            {{connectError}}
          </span>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ApplicationLinkDiscord from "@/core/types/ApplicationLinks/ApplicationLinkDiscord";
import { useClipboardStore } from "@/stores/ClipboardModule";
import { useDesmosNetworkStore } from "@/stores/DesmosNetworkModule";
import { useApplicationLinkStore } from "@/stores/ApplicationLinkModule";
import { Buffer } from "buffer";

export default defineComponent({
  components: {},
  props: {
    username: {
      type: String,
      required: true,
    },
    proof: {
      type: String,
      required: true,
    },
  },
  data(props) {
    const net = useDesmosNetworkStore().isTestnet ? "testnet" : "mainnet";
    const cmdConnect = `!connect ${net} ${props.proof}`;
    return {
      desmosNetworkStore: useDesmosNetworkStore(),
      cmdConnect: cmdConnect,
      isVerifyingConnect: false,
      hasConnected: false,
      connectError: "",
    };
  },
  methods: {
    copy(value: string) {
      useClipboardStore().copy(value);
    },
    async verifyProofUpload(): Promise<boolean> {
      const encodedUsername = encodeURIComponent(this.username);
      const endpoint = this.desmosNetworkStore.isTestnet
        ? `https://themis.morpheus.desmos.network/discord/${encodedUsername}`
        : `https://themis.mainnet.desmos.network/discord/${encodedUsername}`;
      try {
        const response = await fetch(endpoint);
        const json = await response.json();
        if (json.address) {
          return true;
        }
      } catch (e) {
        // failed
      }
      return false;
    },
    async submitApplicationLink() {
      this.hasConnected = false;
      this.connectError = "";
      this.isVerifyingConnect = true;
      const hasUploadedProof = await this.verifyProofUpload();

      // check if !connect has been executed successfully & the proof is uploaded
      if (!hasUploadedProof) {
        this.connectError = "Failed to connect, try again the !connect command";
        this.isVerifyingConnect = false;
        return;
      }
      const callData = Buffer.from(
        JSON.stringify({
          username: this.username,
        })
      ).toString("hex");
      const obj =
        useApplicationLinkStore().generateApplicationLinkWrapperObject(
          "discord",
          this.username,
          callData
        );
      this.$emit("applicationLinkSent", {
        messages: [obj?.message],
        applicationLink: new ApplicationLinkDiscord(this.username),
        memo: obj?.memo,
      });
    },
  },
});
</script>
