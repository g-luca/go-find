<template>
  <span>
    <div
      v-if="$store.state.AccountModule.account._balance>0"
      class="inline"
    >
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium bg-blue-300 rounded-2xl bg-opacity-80 hover:bg-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        @click="toggleModal"
      >
        <i class="bi bi-send-fill" /> Send
      </button>
    </div>
    <span>
      <Dialog
        :open="isOpen"
        @close="toggleModal"
      >
        <div class="fixed inset-0 z-40 overflow-y-auto bg-opacity-50 bg-gray-500">
          <div class="min-h-screen px-4 text-center">
            <span class="inline-block h-screen align-middle"> &#8203; </span>

            <div class="inline-block  w-full sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 2xl:w-4/12 p-6 pb-1 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
              <DialogTitle class="text-3xl font-bold leading-6 text-gray-900 dark:text-white">
                <span class="flex">
                  <div class="text-left my-auto">
                    <h1 class="text-brand text-4xl">Send</h1>
                  </div>
                  <div class="flex-auto text-right">
                    <button class="bg-gray-200 dark:bg-gray-800 rounded-full p-1 hover:text-red-500">
                      <i
                        class="bi bi-x h-12 w-12"
                        @click="toggleModal"
                      />
                    </button>
                  </div>
                </span>
              </DialogTitle>
              <DialogOverlay />
              <div class="dark:text-white py-3 md:px-4">

                <section>
                  <div class="grid grid-cols-12">
                    <!-- Amount -->
                    <div class="col-span-12 mx-auto mb-6 w-full md:w-2/3">
                      <div
                        class="text-center bg-gray-100 dark:bg-gray-800 rounded-3xl pt-2 pb-2 flex"
                        :class="{'ring-red-500 ring-1':!isValidAmount}"
                      >
                        <input
                          v-model="amountRaw"
                          class="font-bold flex-1 w-1/4 bg-gray-100 dark:bg-gray-800 appearance-none outline-none mx-5 text-right text-5xl"
                          :class="{'text-4xl': amountRaw.length > 1 && amountRaw.length < 5,'text-3xl': amountRaw.length >= 5 && amountRaw.length < 8,'text-2xl': amountRaw.length >= 8 && amountRaw.length < 14,'text-xl': amountRaw.length >= 14 && amountRaw.length < 18,'text-lg': amountRaw.length >= 18}"
                          type="text"
                          @keyup="validateAmount"
                        >
                        <span class="text-brand text-2xl font-bold my-auto ring-0 pr-1">
                          <span class="mr-1">{{coinDenom}}</span><br>
                          <span
                            class="underline text-xs text-black dark:text-gray-400 flex font-normal cursor-pointer select-none"
                            @click="setMaxAmount"
                          >max</span>
                        </span>
                      </div>
                      <div
                        class="text-sm text-gray-500 text-center pt-1"
                        :class="{'text-red-500':amount>$store.state.AccountModule.account._balance}"
                      >
                        Available: {{$store.state.AccountModule.account._balance}} {{coinDenom}}
                      </div>
                    </div>

                    <!-- To -->
                    <div class="col-span-12 md:text-left">
                      <div class="flex relative">
                        <span class="rounded-l-3xl inline-flex items-center px-3 text-sm bg-gray-100 dark:bg-gray-800 text-gray-500">
                          To:
                        </span>
                        <div class="rounded-r-3xl pt-2 pb-2 flex-1 bg-gray-100 dark:bg-gray-800">
                          <input
                            v-model="addressTo"
                            class="font-bold bg-gray-100 dark:bg-gray-800 appearance-none outline-none w-11/12 font-mono text-xs md:test-sm"
                            placeholder="Desmos address"
                            type="text"
                            @keyup="validateAddress()"
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Send -->
                    <div
                      v-if="isValidAddress&&isValidAmount"
                      class="col-span-12 mt-10 mx-auto w-2/3"
                    >
                      <button
                        class="bg-brand rounded-xl p-2 w-full"
                        @click="send"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </span>
  </span>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "vue";
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";
import { getModule } from "vuex-module-decorators";
import AccountModule from "@/store/modules/AccountModule";
import { CosmosMsgSend, CosmosTxBody, DesmosJS } from "desmosjs";
import TransactionModule from "@/store/modules/TransactionModule";
const accountModule = getModule(AccountModule);
const transactionModule = getModule(TransactionModule);

export default defineComponent({
  components: { Dialog, DialogOverlay, DialogTitle },
  setup() {
    return {
      isOpen: ref(false),
      coinDenom: process.env.VUE_APP_COIN_DENOM,
      ucoinDenom: process.env.VUE_APP_COIN_FEE_DENOM,
      amountRaw: ref("1"),
      addressTo: ref(""),
      amount: ref(1),
      isValidAddress: ref(false),
      isValidAmount: ref(true),
    };
  },
  methods: {
    async toggleModal() {
      this.isOpen = !this.isOpen;
      this.amountRaw = "1";
      this.addressTo = "";
      this.amount = 1;
      this.isValidAddress = false;
      this.isValidAmount = false;
    },
    setMaxAmount() {
      if (accountModule.account) {
        this.amount = accountModule.account.balance;
        this.amountRaw = String(accountModule.account.balance);
      }
    },
    validateAddress() {
      this.isValidAddress = DesmosJS.addressRegex.test(this.addressTo);
    },
    validateAmount() {
      let isValidNumber = false;
      if (accountModule.account) {
        // check regex
        const amountRegex = /^[0-9.,]{1,}$/;
        const validAmountRaw = amountRegex.exec(this.amountRaw);
        if (validAmountRaw) {
          const amountParsed = Number(Number(this.amountRaw).toFixed(6)); // can use exponential notation
          if (amountParsed >= 0) {
            this.amount = amountParsed;
            isValidNumber = true;
          }
          this.isValidAmount =
            this.amount >= 0.000001 &&
            this.amount <= accountModule.account.balance;
        }
      }

      if (this.amountRaw === "") {
        this.amount = 0;
        this.amountRaw = "";
      }
      if (!isValidNumber && this.amountRaw !== "") {
        this.amountRaw = String(this.amount);
      }
    },
    async send() {
      const sendAmount = this.amount * 1000000;
      if (accountModule.profile) {
        const msgSend: CosmosMsgSend = {
          fromAddress: accountModule.profile.address,
          toAddress: this.addressTo,
          amount: [
            {
              denom: this.ucoinDenom!,
              amount: sendAmount.toString(),
            },
          ],
        };
        const txBody: CosmosTxBody = {
          memo: "Send | Go-find",
          messages: [
            {
              typeUrl: "/cosmos.bank.v1beta1.MsgSend",
              value: CosmosMsgSend.encode(msgSend).finish(),
            },
          ],
          extensionOptions: [],
          nonCriticalExtensionOptions: [],
          timeoutHeight: 0,
        };
        await this.toggleModal();
        transactionModule.start(txBody);
      }
    },
  },
});
</script>