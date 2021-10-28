<template>
  <section>
    <Form v-slot="{ meta, errors }">
      <!-- Twitter post value -->
      <section class="grid grid-cols-12 -mx-4 py-4">
        <div class="col-span-12 md:col-span-1">
          <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 text-brand select-none">
            1
          </span>
        </div>
        <div class="col-span-11 dark:text-white text-lg">
          <h1>
            Post this tweet with that account
            <button
              type="button"
              class="py-1 px-4 flex justify-center items-center w-full rounded-lg "
              style="background:#1DA1F2"
              @click="shareTweet()"
            >
              <img
                src="@/assets/brands/twitter/logo.svg"
                class="w-10 h-10"
                alt=""
              >
              Share
            </button>
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
            2
          </span>
        </div>
        <div class="col-span-11 dark:text-white text-lg">
          <div class="col-span-2 py-2">
            <label
              for="inputTweetUrl"
              class="dark:text-white text-md"
            >
              Copy here the Tweet link
            </label>
            <Field
              id="inputTweetUrl"
              v-model="inputTweetUrl"
              :rules="{ required:true,regex: /^(https:\/\/twitter.com\/)(.{3,100})\/status\/(.{4,100})$/ }"
              type="text"
              class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
              name="inputTweetUrl"
              :placeholder="'https://twitter.com/'+this.username+'/status/123456789'"
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
          class="py-2 ml-0 md:ml-4 w-full bg-purple-600 hover:bg-purple-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
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
    proofUrl: {
      type: String,
      required: true,
    },
  },
  emits: ["applicationLinkSent"],
  data() {
    return {
      inputTweetUrl: "",
      tweetId: "",
    };
  },
  methods: {
    updateTweetUrl() {
      if (this.inputTweetUrl) {
        try {
          this.tweetId = this.inputTweetUrl.split("/status/")[1];
        } catch (e) {
          console.log("invalid tweet url");
        }
      }
    },
    shareTweet() {
      const tweetText = `Hey everyone! I'm verifying my #DesmosProfile using #GoFindMe with this proof: ${this.proofUrl}`;
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          tweetText
        )}`,
        "_blank"
      );
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
