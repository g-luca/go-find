<template>
  <TransitionRoot
    appear
    :show="$store.state.TransactionModule.isOpen"
    as="template"
  >
    <Dialog @close="closeModal">
      <div class="fixed inset-0 z-50 overflow-y-auto bg-opacity-50 bg-gray-500">
        <div class="min-h-screen px-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
          >
            <DialogOverlay class="fixed inset-0" />
          </TransitionChild>

          <span
            class="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div class="inline-block w-full max-w-md p-6 pb-1 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <DialogTitle class="text-3xl font-bold leading-6 text-gray-900 dark:text-white">
              <span class="flex">
                <div class="flex text-brand">Confirm Transaction</div>
                <div class="flex-auto text-right">
                  <button
                    v-if="$store.state.TransactionModule.transactionStatus!==1"
                    ref="closeModalButtonRef"
                    tabindex="1"
                  >
                    <i
                      class="bi bi-x h-12 w-12"
                      @click="closeModal()"
                    />
                  </button>
                </div>
              </span>
            </DialogTitle>
            <section v-if="$store.state.TransactionModule.transactionStatus!==2">
              <!-- Registered user Transaction -->
              <span v-if="!$store.state.AuthModule._account.isUsingKeplr">
                <label
                  class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
                  for="inputMPassword"
                >Wallet Password</label>
                <input
                  id="inputMPassword"
                  v-model="inputMPassword"
                  type="password"
                  required="required"
                  class="relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-300 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-600 dark:text-white"
                  placeholder="Wallet Password"
                >
              </span>

              <div class="pt-3 pb-1">
                <!-- <div class="pt-4">
              <span class="font-semibold text-lg dark:text-white">
                Fees:
              </span>
              <span class="text-brand">
                {{ tx.$tx.$fee.$amount[0].$amount }}
              </span>
              <span class="uppercase pl-1 font-mono dark:text-white">
                {{ tx.$tx.$fee.$amount[0].$denom }}
              </span>
            </div> -->
                <span v-if="$store.state.AccountModule.account._balance>0">
                  <div class="pt-4">
                    <button
                      v-if="(!$store.state.AuthModule._account.isUsingKeplr&&inputMPassword.length>0)||$store.state.AuthModule._account.isUsingKeplr"
                      :disabled="$store.state.TransactionModule.transactionStatus===1"
                      type="button"
                      :class="{'bg-gray-500 hover:bg-gray-500': $store.state.TransactionModule.transactionStatus===1, 'bg-indigo-600 hover:bg-indigo-700': $store.state.TransactionModule.transactionStatus!==1}"
                      class="py-2 px-4 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                      @click="sign()"
                    >
                      <span
                        v-if="$store.state.TransactionModule.transactionStatus===1"
                        class="text-center"
                      >
                        <svg
                          class="animate-spin mx-auto h-7 w-7 text-brand"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          />
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </span>
                      <span v-else>
                        Confirm
                      </span>
                    </button>
                  </div>
                </span>
                <span v-else>
                  <h1 class="text-md"><i class="bi bi-exclamation-triangle text-red-500" /> Your actual balance cannot cover transaction fees.</h1>
                </span>
                <div
                  v-if="$store.state.TransactionModule.transactionStatus===-1"
                  class="pt-2"
                >
                  <p class="text-red-700">
                    {{ $store.state.TransactionModule.errorMessage }}
                  </p>
                </div>
                <div class="pt-2 text-gray-400">
                  <i class="bi bi-wifi-off text-md " />
                  <span class="text-xs">
                    Transactions are always signed offline
                  </span>
                </div>
              </div>
            </section>
            <section v-if="$store.state.TransactionModule.transactionStatus===2">
              <div class="pt-4 text-center">
                <i class="bi bi-check2-circle text-green-500 text-7xl" />
                <h4 class="pt-2 pb-4 text-3xl dark:text-white">
                  Transaction Success
                </h4>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" src="./ModalTransaction.ts"/>
