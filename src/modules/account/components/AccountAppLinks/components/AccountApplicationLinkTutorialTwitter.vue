<template>
  <section>
    <Form v-slot="{ meta, errors }">
      <!-- Twitter verification method select -->
      <section class="grid grid-cols-12 py-6">
        <div class="col-span-12 md:col-span-1">
          <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 dark:bg-gray-700 text-brand select-none">
            1
          </span>
        </div>
        <div class="col-span-12 md:col-span-11 dark:text-white text-lg md:pl-8">
          <h1 class="text-xl font-bold">Choose the verification method</h1>
          <div class="grid grid-cols-12">
            <div
              v-for="method of verificationMethods"
              class="col-span-12 md:col-span-5 xl:col-span-4 m-1 rounded-3xl bg-gray-100 dark:bg-denim-900 dark:hover:bg-purple-800 hover:bg-purple-200 cursor-pointer"
              @click="selectVerificationMethod(method)"
            >
              <div class="grid grid-cols-12">
                <div class="col-span-4 py-4">
                  <a
                    class="p-4 pointer-events-none select-none text-3xl w-auto bi"
                    :class="method.icon"
                  />
                </div>
                <div class="col-span-5 my-auto">
                  <h5 class="dark:text-white text-2xl capitalize">
                    {{ method.name }}
                  </h5>
                </div>
                <div class="col-span-3 text-right my-auto pr-4">
                  <i
                    v-if="selectedVerificationMethod.id === method.id"
                    class="bi bi-check-circle text-xl text-seagreen-500"
                  />
                  <i
                    v-else
                    class="bi bi-circle text-xl dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tweet procedure -->
      <section v-if="selectedVerificationMethod.id === 'tweet'">
        <!-- Twitter post value -->
        <section class="grid grid-cols-12 py-6">
          <div class="col-span-12 md:col-span-1">
            <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 dark:bg-gray-700 text-brand select-none">
              2
            </span>
          </div>
          <div class="col-span-12 md:col-span-11 dark:text-white text-lg md:pl-8">
            <h1 class="text-xl font-bold">
              Post this tweet with your account
              <button
                type="button"
                class="py-1 px-4 flex justify-center items-center w-full rounded-lg text-white"
                style="background: #1da1f2"
                @click="shareTweet()"
              >
                <img
                  src="@/assets/brands/twitter/logo.svg"
                  class="w-10 h-10"
                  alt=""
                />
                Share
              </button>
            </h1>
          </div>
        </section>

        <!-- Twitter Link -->
        <section
          v-if="!errors.inputPasteUrl"
          class="grid grid-cols-12 py-6"
        >
          <div class="col-span-12 md:col-span-1">
            <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 dark:bg-gray-700 text-brand select-none">
              3
            </span>
          </div>
          <div class="col-span-12 md:col-span-11 dark:text-white text-lg md:pl-8">
            <div class="col-span-2 py-2">
              <label
                for="inputTweetUrl"
                class="dark:text-white text-xl font-bold"
              >
                Copy the Tweet link
              </label>
              <Field
                id="inputTweetUrl"
                v-model="inputTweetUrl"
                :rules="{
                  required: true,
                  regex: /^(https:\/\/twitter.com\/)(.{3,100})\/status\/(.{4,100})$/,
                }"
                type="text"
                class="rounded-lg border w-full py-3 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 dark:border-gray-700 shadow-sm text-base focus:outline-none"
                name="inputTweetUrl"
                :placeholder="
                  'https://twitter.com/' + this.username + '/status/123456789'
                "
                @input="updateTweetUrl()"
              />
              <span
                v-if="errors.inputTweetUrl && meta.dirty && meta.touched"
                class="text-red-700"
              >
                This is not a valid Tweet
              </span>
            </div>
          </div>
        </section>
      </section>

      <!-- Bio Procedure -->

      <section v-if="selectedVerificationMethod.id === 'bio'">
        <!-- Twitter bio value -->
        <section class="grid grid-cols-12 py-6">
          <div class="col-span-12 md:col-span-1">
            <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 dark:bg-gray-700 text-brand select-none">
              2
            </span>
          </div>
          <div class="col-span-12 md:col-span-11 dark:text-white text-lg md:pl-8">
            <h1 class="text-xl font-bold">Add this link to your bio</h1>
            <p class="text-base">
              This must to be the only link in your bio during the verification process,
              once verified you can remove it.
            </p>
            <div class="my-2 p-3 bg-gray-600 dark:bg-black rounded-xl text-sm">
              <div class="p-3 overflow-x-auto text-white font-mono">
                {{ proofUrl }}
              </div>
              <button
                type="button"
                class="px-4 py-1 text-sm font-light text-white hover:text-brand"
                @click="copy(proofUrl)"
              >
                <i class="bi bi-clipboard cursor-pointer" />
                Copy
              </button>
            </div>
          </div>
        </section>
      </section>

      <!-- Send Application Link -->
      <section v-if="
          (selectedVerificationMethod.id === 'tweet' && tweetId) ||
          selectedVerificationMethod.id === 'bio'
        ">
        <div class="text-red-500 py-1 pl-4">
          {{this.checkError}}
        </div>
        <button
          type="button"
          class="py-2 w-full bg-purple-600 hover:bg-purple-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          @click="submitApplicationLink()"
        >
          Submit
        </button>
      </section>
    </Form>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Field, Form } from "vee-validate";
import ApplicationLinkModule from "@/store/modules/ApplicationLinkModule";
import ApplicationLinkTwitter from "@/core/types/ApplicationLinks/ApplicationLinkTwitter";
import { useClipboardStore } from "@/stores/ClipboardModule";

class TwitterVerificationMethod {
  public id: string;
  public name: string;
  public icon: string;
  public description: string;

  constructor(_id: string, _name: string, _icon: string, _description: string) {
    this.id = _id;
    this.name = _name;
    this.icon = _icon;
    this.description = _description;
  }
}

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
    const verificationMethods = [
      new TwitterVerificationMethod(
        "tweet",
        "Tweet",
        "bi-chat-text-fill",
        "Post a tweet with the prooff"
      ),
      new TwitterVerificationMethod(
        "bio",
        "Biography",
        "bi-person-fill",
        "Add the proof to your biography"
      ),
    ];
    return {
      inputTweetUrl: "",
      tweetId: "",
      verificationMethods: verificationMethods,
      selectedVerificationMethod: verificationMethods[0],
      checkError: "",
    };
  },
  methods: {
    copy(value: string) {
      useClipboardStore().copy(value);
    },
    updateTweetUrl() {
      if (this.inputTweetUrl) {
        try {
          this.tweetId = this.inputTweetUrl.split("/status/")[1];
          this.tweetId = this.tweetId.split("?")[0]; // ignore possible query params
        } catch (e) {
          console.log("invalid tweet url");
        }
      }
    },
    selectVerificationMethod(method: TwitterVerificationMethod) {
      this.selectedVerificationMethod = method;
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
      if (this.selectedVerificationMethod.id === "tweet") {
        this.submitApplicationLinkTweet();
      } else {
        this.submitApplicationLinkBio();
      }
    },
    async submitApplicationLinkBio() {
      this.checkError = "";
      let checkSuccess = false;
      const endpointCheck = `https://themis.mainnet.desmos.network/twitter/users/${this.username}`;
      const regexpCheck = new RegExp("(https?://[^s]+)");
      try {
        const res = await (await fetch(endpointCheck)).json();
        if (regexpCheck.test(res.bio)) {
          checkSuccess = true;
        }
      } catch (e) {
        // check failed
      }
      if (checkSuccess) {
        const data = {
          method: "bio",
          value: this.username,
        };
        const callData = Buffer.from(JSON.stringify(data)).toString("hex");
        const txBody = ApplicationLinkModule.generateApplicationLinkTxBody(
          "twitter",
          this.username,
          callData
        );
        this.$emit("applicationLinkSent", {
          txBody: txBody,
          applicationLink: new ApplicationLinkTwitter(this.username),
        });
      } else {
        this.checkError = "Twitter biography link not found";
      }
    },
    async submitApplicationLinkTweet() {
      const data = {
        method: "tweet",
        value: this.tweetId,
      };
      const callData = Buffer.from(JSON.stringify(data)).toString("hex");
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
