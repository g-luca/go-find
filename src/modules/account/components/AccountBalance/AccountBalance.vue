<template>
  <section>
    <span v-if="$store.state.AccountModule.profileLoadingStatus">
      <div class="bg-white dark:bg-gray-900 overflow-hidden shadow-xl hover:shadow-2xl rounded-3xl relative mb-8 mt-8 lg:mt-0">
        <img
          src="@/assets/brands/desmos/logo.svg"
          alt="desmos logo"
          class="h-24 w-24 absolute opacity-50 -right-1 pointer-events-none"
        >
        <div class="px-4 pt-5 pb-2 sm:pt-6">
          <dl>
            <dt class="text-3xl leading-5 font-medium dark:text-gray-200 truncate py-1">
              Wallet
            </dt>
            <div class="font-mono text-md truncate py-2 dark:text-gray-400 text-gray-700">
              {{ $store.state.AccountModule.account._address }}
            </div>

            <!-- Balance value -->
            <div>
              <span class="text-brand font-bold pt-1 text-6xl">
                {{ splitNumberLeft($store.state.AccountModule.account._balance,".") }}
                <span class="text-sm">
                  .{{ splitNumberRight($store.state.AccountModule.account._balance,".") }}
                </span>
                <span class="text-black dark:text-white pl-4 text-4xl">
                  DSM
                </span>
              </span>
            </div>

            <span v-if="$store.state.AccountModule.account._delegations>0">
              <div class="grid grid-cols-2 pt-4">
                <!-- Delegations -->
                <div class="col-span-1">
                  <div class="pt-2 text-left">
                    <p class="font-semibold dark:text-white">
                      Delegated
                    </p>
                    <span class="text-indigo-600 font-bold py-1 text-2xl">
                      {{ splitNumberLeft($store.state.AccountModule.account._delegations,".") }}
                      <span class="text-sm">
                        .{{ splitNumberRight($store.state.AccountModule.account._delegations,".") }}
                      </span>
                      <span class="text-gray-700 dark:text-gray-300 pl-2 text-lg">
                        DSM
                      </span>
                    </span>
                  </div>
                </div>

                <!-- Total -->
                <div class="col-span-1">
                  <div class="pt-2 text-right">
                    <p class="font-semibold dark:text-white">
                      Total
                    </p>
                    <span class="text-pink-600 font-bold py-1 text-2xl">
                      {{ splitNumberLeft($store.state.AccountModule.account._delegations + $store.state.AccountModule.account._balance,".") }}
                      <span class="text-sm">
                        .{{ splitNumberRight($store.state.AccountModule.account._delegations+ $store.state.AccountModule.account._balance,".") }}
                      </span>
                      <span class="text-gray-700 dark:text-gray-300 pl-2 text-lg">
                        DSM
                      </span>
                    </span>
                  </div>
                </div>

              </div>
              <p class="font-extralight text-xs text-right pt-2 dark:text-white">
                <i class="bi bi-question-circle" /> To use your delegated balance, you have to unbond first.
              </p>
            </span>
          </dl>
        </div>
      </div>
    </span>
    <span v-else>
      <!-- Loading -->
      <SkeletonLoader
        shape="rectangle"
        class="py-4 text-left w-full h-32 px-2"
      />

    </span>
  </section>
</template>

<script lang="ts" src="./AccountBalance.ts"/>