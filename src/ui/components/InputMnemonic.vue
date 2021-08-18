<template>
  <div>
    <section>
      <div class="pt-4 text-xl">
        <span class="text-gray-500"> Write your mnemonic: </span>
      </div>

      <span v-if="isNew">
        <input
          id="isInputMnemonicString"
          v-model="isInputMnemonicString"
          type="checkbox"
        >
        <label
          for="isInputMnemonicString"
          class="select-none text-gray-500"
        > Input as text</label><br>
      </span>

      <span v-if="!isInputMnemonicString">
        <div class="grid grid-cols-8 gap-x-8 gap-y-4 pt-2 pb-8">
          <div
            v-for="(word,index) in inputMnemonic"
            class="col-span-4 lg:col-span-2 border-b-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-900 rounded"
          >
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 text-sm">
                  {{ index+1 }}
                </span>
              </div>
              <input
                :key="index"
                v-model="inputMnemonic[index]"
                :disabled="!isNew"
                class="block w-full pl-8 dark:bg-gray-900 bg-gray-50 text-xl lowercase dark:text-white"
                @input="validateInputMnemonic()"
              >
            </div>
          </div>
        </div>
      </span>

      <span v-if="isNew&&isInputMnemonicString">
        <textarea
          v-model="inputMnemonicString"
          rows="3"
          class="block w-full px-1 my-4 py-2 dark:bg-gray-900 bg-gray-100 rounded-md text-xl lowercase dark:text-white"
          @input="validateInputMnemonic()"
        />
      </span>

      <div v-if="isValidMnemonic||!isNew">
        <div class="py-2">
          <span class="text-xl break-all pl-1">
            <span class="text-gray-500"> Address: </span>
            <span class="font-medium border-b-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-900 dark:text-white rounded pl-2 pr-2">{{ $store.state.RegisterModule.address }}</span>
          </span>
        </div>
      </div>

      <div v-if="!isValidMnemonic&&isNew&&((inputMnemonicString.split(' ').length>12&&isInputMnemonicString)||(inputMnemonic.length>12&&!isInputMnemonicString))">
        <p class="text-gray-500">
          This mnemonic is not valid. Check each word carefully!
        </p>
      </div>

      <div v-if="!isNew">
        <div class="text-right text-sm grid grid-cols-12 pt-6">
          <div class="col-span-9 text-left my-auto">
            <h4 class="lg:text-lg dark:text-white">
              The words of the mnemonic are the only way to recover your account, <b>store it in a secure place!</b>
            </h4>
          </div>
          <div class="col-span-3">
            <button
              class="m-1 py-1 px-3 bg-blue-500 text-white rounded"
              @click="downloadMnemonic()"
            >
              <i class="bi bi-download pr-2" />Download
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { validateMnemonic } from "bip39";

export default defineComponent({
  props: {
    generatedMnemonic: {
      type: String,
      default: "",
    },
  },
  emits: ["onMnemonic"],
  data() {
    return {
      isNew: true,
      isValidMnemonic: false,
      inputMnemonic: new Array<string>(24),
      isInputMnemonicString: false,
      inputMnemonicString: "",
    };
  },
  updated() {
    if (this.generatedMnemonic) {
      this.isNew = false;
      this.inputMnemonic = this.generatedMnemonic.split(" ");
    }
  },
  methods: {
    validateInputMnemonic(): void {
      let mnemonic = "";
      if (!this.isInputMnemonicString) {
        this.inputMnemonic.forEach((word, i) => {
          this.inputMnemonic[i] = word.trim();
        });
        mnemonic = this.inputMnemonic.join(" ");
      } else {
        mnemonic = this.inputMnemonicString;
      }
      if (validateMnemonic(mnemonic)) {
        this.isValidMnemonic = true;
        this.$emit("onMnemonic", mnemonic);
      } else {
        this.isValidMnemonic = false;
        this.$emit("onMnemonic", "");
      }
    },
    downloadMnemonic(): void {
      const file =
        "data:text/text;charset=utf-8," +
        encodeURIComponent(this.inputMnemonic.join(" "));
      const filename = `wallet-mnemonic.txt`;
      const downloadElem = document.createElement("a");
      if (downloadElem != null) {
        downloadElem.setAttribute("href", file);
        downloadElem.setAttribute("download", filename);
        downloadElem.click();
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>