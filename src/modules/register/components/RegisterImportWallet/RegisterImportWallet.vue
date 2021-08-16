<template>
  <div>
    <div>
      <div class="text-gray-500 text-sm pb-5">
        <button @click="goBack()">
          <i class="bi bi-arrow-left" /> Generate Wallet
        </button>
      </div>
      <div>
        <h2 class="dark:text-gray-50 text-gray-800 pb-1 font-medium text-3xl text-center">
          Your Desmos wallet for @<span class="text-brand">{{ $store.state.RegisterModule.dtag }}</span>
        </h2>
      </div>
    </div>
    <div class="pt-4 text-xl">
      <span class="text-gray-500"> Write your mnemonic: </span>
    </div>
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
            class="block w-full pl-8 dark:bg-gray-900 bg-gray-50 text-xl lowercase dark:text-white"
            @input="validateInputMnemonic()"
          >
        </div>
      </div>
    </div>

    <div v-if="isValidMnemonic">
      <div class="py-2">
        <span class="text-xl break-all pl-1">
          <span class="text-gray-500"> Address: </span>
          <span class="font-medium border-b-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-900 dark:text-white rounded pl-2 pr-2">{{ $store.state.RegisterModule.address }}</span>
        </span>
      </div>
      <button
        type="button"
        class="relative block w-full justify-center py-2 px-4 border border-transparent text-md rounded-md font-extrabold
               text-white bg-brand opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 dark:ring-offset-denim-900 focus:ring-offset-2 focus:ring-brand"
        @click="completeRegistration()"
      >
        Complete
        <span class="absolute right-0 inset-y-0 flex items-center pr-3">
          <i class="bi bi-arrow-right" />
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" src="./RegisterImportWallet.ts"/>
