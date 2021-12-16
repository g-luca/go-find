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
            <div class="mb-6">
              <div class="grid grid-cols-12">

                <!-- Send -->
                <div
                  v-if="$store.state.AccountModule.account._balance>0"
                  class="col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1"
                >
                  <ModalSend />
                </div>

                <!-- Staking -->
                <div class="col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1">
                  <ModalStaking />
                </div>

                <!-- Airdrop -->
                <span
                  v-if="$store.state.AirdropModule.config!==null&&$store.state.AirdropModule.config.airdrop_enabled===true"
                  class="col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1"
                >

                  <button
                    type="button"
                    class="text-white dark:text-white hover:text-red-500 dark:hover:text-red-500"
                    @click="toggleAirdropModal()"
                  >
                    <div class="py-1.5 px-2 text-lg font-medium bg-seagreen-500 rounded-full focus:outline-none focus-visible:ring-2">
                      <i class="bi bi-gift text-xl" />
                    </div>
                    <div class="dark:text-gray-200 text-black text-sm font-thin">Airdrop</div>
                  </button>
                </span>

              </div>
            </div>

            <!-- Balance value -->
            <div>
              <span class="text-brand font-bold pt-1 text-6xl">
                {{ splitNumberLeft($store.state.AccountModule.account._balance,".") }}
                <span class="text-sm">
                  .{{ splitNumberRight($store.state.AccountModule.account._balance,".") }}
                </span>
                <span class="text-black dark:text-white pl-4 text-4xl">
                  {{coinDenom}}
                </span>
              </span>
            </div>

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
    <AccountAirdrop />
  </section>
</template>

<script lang="ts" src="./AccountBalance.ts"/>