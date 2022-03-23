<template>
  <section>
    <!-- Github Proof -->
    <section class="grid grid-cols-12 py-4">
      <div class="col-span-12 md:col-span-1">
        <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 dark:bg-gray-700 text-brand select-none">
          1
        </span>
      </div>
      <div class="col-span-12 md:col-span-11 dark:text-white text-xl font-bold md:pl-8 md:pl-8">
        Create a <b>TXT</b> DNS record for your domain, with this value:

        <div class="my-2 p-3 bg-gray-600 dark:bg-black rounded-xl text-sm">
          <div class="p-3 overflow-x-auto text-white font-mono">
            {{ proof }}
          </div>
          <button
            type="button"
            class="px-4 py-1 text-sm font-light text-white hover:text-brand"
            @click="copy(proof)"
          >
            <i class="bi bi-clipboard cursor-pointer" />
            Copy
          </button>
        </div>
      </div>
    </section>

    <!-- Send Application Link -->
    <section>
      <div class="text-red-500 py-1 pl-4">
        {{this.checkError}}
      </div>
      <button
        type="button"
        class="py-2 ml-0 md:ml-4 w-full bg-purple-600 hover:bg-purple-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
        @click="submitApplicationLink()"
      >
        Submit
      </button>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ApplicationLinkDomain from "@/core/types/ApplicationLinks/ApplicationLinkDomain";
import { useClipboardStore } from "@/stores/ClipboardModule";
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
  emits: ["applicationLinkSent"],
  data() {
    return {
      checkError: "",
    };
  },
  methods: {
    copy(value: string) {
      useClipboardStore().copy(value);
    },
    async submitApplicationLink() {
      const domain = this.username;

      this.checkError = "";
      let checkSuccess = false;
      const endpointCheck = `https://themis.mainnet.desmos.network/nslookup/${domain}`;
      try {
        const res = await (await fetch(endpointCheck)).json();
        const records = res.txt;
        records.forEach((recordRaw: any) => {
          try {
            const parsed = JSON.parse(recordRaw.text);
            if (parsed.address) {
              checkSuccess = true;
            }
          } catch (e) {
            // invalid record
          }
        });
      } catch (e) {
        // check failed
      }
      if (checkSuccess) {
        const callData = Buffer.from(
          JSON.stringify({
            domain,
          })
        ).toString("hex");
        const txBody = useApplicationLinkStore().generateApplicationLinkTxBody(
          "domain",
          domain,
          callData
        );
        this.$emit("applicationLinkSent", {
          txBody: txBody,
          applicationLink: new ApplicationLinkDomain(this.username),
        });
      } else {
        this.checkError = "Domain TXT DNS record not found";
      }
    },
  },
});
</script>
