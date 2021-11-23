<template>
  <section>
    <!-- Pastebin Url to copy in bio -->
    <section class="grid grid-cols-12  py-4">
      <div class="col-span-12 md:col-span-1">
        <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 dark:bg-gray-700 text-brand select-none">
          1
        </span>
      </div>
      <div class="col-span-12 md:col-span-11 dark:text-white text-lg md:pl-8">
        <div class="col-span-2 py-2">
          <p class="dark:text-white text-xl font-bold">Now add this link to your Twitch account description.</p>
          <div class="my-2 p-3 bg-black rounded-xl text-sm">
            <div class="p-3 overflow-x-auto text-white">
              {{ proofUrl }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Send Application Link -->
    <section>
      <button
        type="button"
        class="py-2 ml-0 md:ml-4 w-full bg-purple-600 hover:bg-purple-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
        @click="submitApplicationLink()"
      >
        Submit
      </button>
    </section>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import ApplicationLinkModule from "@/store/modules/ApplicationLinkModule";
import ApplicationLinkTwitch from "@/core/types/ApplicationLinks/ApplicationLinkTwitch";

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
    proofUrl: {
      type: String,
      required: true,
    },
  },
  emits: ["applicationLinkSent"],
  data() {
    return {
      inputPasteUrl: "",
      pasteRawUrl: "",
    };
  },
  methods: {
    submitApplicationLink() {
      const callData = Buffer.from(
        JSON.stringify({
          username: this.username,
        })
      ).toString("hex");
      const txBody = ApplicationLinkModule.generateApplicationLinkTxBody(
        "twitch",
        this.username,
        callData
      );
      this.$emit("applicationLinkSent", {
        txBody: txBody,
        applicationLink: new ApplicationLinkTwitch(this.username),
      });
    },
  },
});
</script>
