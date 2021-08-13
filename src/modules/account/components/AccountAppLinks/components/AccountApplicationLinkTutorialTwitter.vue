<template>
  <section>
    <Form v-slot="{ meta, errors }">
      <!-- Pastebin Proof -->
      <section class="grid grid-cols-12 -mx-4 py-4">
        <div class="col-span-12 md:col-span-1">
          <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-brand select-none">
            1
          </span>
        </div>
        <div class="col-span-11 dark:text-white text-lg">
          Create a <a
            href="https://pastebin.com/"
            class="text-blue-500 underline"
            target="_blank"
          >Pastebin</a> with this exact content:

          <div class="my-2 p-3 bg-black rounded-xl text-sm">
            <div class="p-3 overflow-x-auto text-white">
              {{ proof }}
            </div>
          </div>
        </div>
      </section>

      <!-- Pastebin Link -->
      <section class="grid grid-cols-12 -mx-4 py-4">
        <div class="col-span-12 md:col-span-1">
          <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-brand select-none">
            2
          </span>
        </div>
        <div class="col-span-11 dark:text-white text-lg">
          <div class="col-span-2 py-2">
            <label
              for="inputPasteUrl"
              class="dark:text-white text-md"
            >
              After you have ceated the Pastebin, copy here the generated url
            </label>
            <Field
              id="inputPasteUrl"
              v-model="inputPasteUrl"
              :rules="{ required:true,regex: /^(https:\/\/pastebin.com\/)(.{4,100})$/ }"
              type="text"
              class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
              name="inputPasteUrl"
              placeholder="https://pastebin.com/tS7A3SSn"
              @input="updatePasteUrl()"
            />
            <span
              v-if="errors.inputPasteUrl&&meta.dirty&&meta.touched"
              class="text-red-700"
            >
              The input is not a valid Pastebin url
            </span>
          </div>
        </div>
      </section>

      <!-- Twitter post value -->
      <section class="grid grid-cols-12 -mx-4 py-4">
        <div class="col-span-12 md:col-span-1">
          <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-brand select-none">
            3
          </span>
        </div>
        <div class="col-span-11 dark:text-white text-lg">
          <h1>
            Now, post a tweet this link:
            <div class="my-2 p-2 bg-blue-500 rounded-xl text-lg">
              <div class="p-2 overflow-x-auto text-white">
                {{ pasteRawUrl }}
              </div>
            </div>
          </h1>
        </div>
      </section>

      <!-- Twitter Link -->
      <section
        v-if="!errors.inputPasteUrl"
        class="grid grid-cols-12 -mx-4 py-4"
      >
        <div class="col-span-12 md:col-span-1">
          <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-brand select-none">
            4
          </span>
        </div>
        <div class="col-span-11 dark:text-white text-lg">
          <div class="col-span-2 py-2">
            <label
              for="inputTweetUrl"
              class="dark:text-white text-md"
            >
              After you have ceated the Tweet, copy here the tweet url
            </label>
            <Field
              id="inputTweetUrl"
              v-model="inputTweetUrl"
              :rules="{ required:true,regex: /^(https:\/\/twitter.com\/)(.{3,100})\/status\/(.{4,100})$/ }"
              type="text"
              class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
              name="inputTweetUrl"
              placeholder="https://twitter.com/ricmontagnin/status/1368883070590476292"
              @input="updateTweetUrl()"
            />
            <span
              v-if="errors.inputTweetUrl&&meta.dirty&&meta.touched"
              class="text-red-700"
            >
              This is not a valid Tweet
            </span>
          </div>
        </div>
      </section>

      <!-- Send Application Link -->
      <section v-if="tweetId">
        <button
          type="button"
          class="py-2 px-4 w-6/12 bg-purple-600 hover:bg-purple-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
          @click="submitApplicationLink()"
        >
          Submit
        </button>
      </section>
    </Form>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import { Field, Form } from "vee-validate";
import ApplicationLinkModule from "@/store/modules/ApplicationLinkModule";
import ApplicationLinkTwitter from "@/core/types/ApplicationLinks/ApplicationLinkTwitter";

export default defineComponent({
  components: {
    Field,
    Form,
  },
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
      inputPasteUrl: "",
      pasteRawUrl: "",
      inputTweetUrl: "",
      tweetId: "",
    };
  },
  methods: {
    updatePasteUrl() {
      if (this.inputPasteUrl) {
        try {
          this.pasteRawUrl = `https://pastebin.com/raw/${
            this.inputPasteUrl.split("https://pastebin.com/")[1]
          }`;
        } catch (e) {
          console.log("invalid paste url");
        }
      }
    },
    updateTweetUrl() {
      if (this.inputTweetUrl) {
        try {
          this.tweetId = this.inputTweetUrl.split("/status/")[1];
        } catch (e) {
          console.log("invalid tweet url");
        }
      }
    },
    submitApplicationLink() {
      const callData = Buffer.from(
        JSON.stringify({
          method: "tweet",
          value: this.tweetId,
        })
      ).toString("hex");
      const txBody = ApplicationLinkModule.generateApplicationLinkTxBody(
        "twitter",
        this.username,
        callData
      );
      this.$emit("applicationLinkSent", {
        txBody: txBody,
        applicationLink: new ApplicationLinkTwitter(this.username),
      });
    },
  },
});
</script>
