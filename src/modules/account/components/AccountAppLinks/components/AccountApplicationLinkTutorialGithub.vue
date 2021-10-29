<template>
  <section>
    <Form v-slot="{ meta, errors }">
      <!-- Github Proof -->
      <section class="grid grid-cols-12  py-4">
        <div class="col-span-12 md:col-span-1">
          <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 dark:bg-gray-700 text-brand select-none">
            1
          </span>
        </div>
        <div class="col-span-12 md:col-span-11 dark:text-white text-xl font-bold md:pl-8 md:pl-8">
          Create a <b>public</b> <a
            href="https://gist.github.com/"
            class="text-blue-500 underline"
            target="_blank"
          >Github Gist</a> with this exact content:

          <div class="my-2 p-3 bg-black rounded-xl text-sm">
            <div class="p-3 overflow-x-auto text-white">
              {{ proof }}
            </div>
          </div>
        </div>
      </section>

      <!-- Github Link -->
      <section class="grid grid-cols-12  py-4">
        <div class="col-span-12 md:col-span-1">
          <span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-blue-50 dark:bg-gray-700 text-brand select-none">
            2
          </span>
        </div>
        <div class="col-span-12 md:col-span-11 dark:text-white text-lg md:pl-8">
          <div class="col-span-2 py-2">
            <label
              for="inputGistUrl"
              class="dark:text-white text-xl font-bold"
            >
              After you have ceated the Gist, copy here the generated url
            </label>
            <Field
              id="inputGistUrl"
              v-model="inputGistUrl"
              :rules="{ required:true,regex: /^(https:\/\/gist.github.com\/)(.{3,100})\/(.{4,100})$/ }"
              type="text"
              class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
              name="inputGistUrl"
              placeholder="https://gist.github.com/g-luca/cd079ecb0ea1805f9291e6c5953cd570"
              @input="updateGistUrl()"
            />
            <span
              v-if="errors.inputGistUrl&&meta.dirty&&meta.touched"
              class="text-red-700"
            >
              The input is not a valid public Github gist url
            </span>
          </div>
        </div>
      </section>

      <!-- Send Application Link -->
      <section v-if="gistId">
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
import ApplicationLinkGithub from "@/core/types/ApplicationLinks/ApplicationLinkGithub";

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
      inputGistUrl: "",
      gistId: "",
    };
  },
  methods: {
    updateGistUrl() {
      if (this.inputGistUrl) {
        try {
          this.gistId = this.inputGistUrl.split(
            `https://gist.github.com/${this.username}/`
          )[1];
        } catch (e) {
          console.log("invalid paste url");
        }
      }
    },
    submitApplicationLink() {
      const callData = Buffer.from(
        JSON.stringify({
          username: this.username,
          gist_id: this.gistId,
        })
      ).toString("hex");
      const txBody = ApplicationLinkModule.generateApplicationLinkTxBody(
        "github",
        this.username,
        callData
      );
      this.$emit("applicationLinkSent", {
        txBody: txBody,
        applicationLink: new ApplicationLinkGithub(this.username),
      });
    },
  },
});
</script>
