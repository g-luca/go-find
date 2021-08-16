<template>
  <div>
    <div>
      <div class="text-gray-500 text-sm pb-5">
        <button @click="goBack()">
          <i class="bi bi-arrow-left" /> Change Encryption Password
        </button>
      </div>
      <div>
        <h2 class="dark:text-gray-50 text-gray-800 pb-1 font-medium text-3xl text-center">
          Your Desmos wallet for @<span class="text-brand">{{ $store.state.RegisterModule.dtag }}</span>
        </h2>
        <div class="text-center w-full">
          <button
            class="dark:text-gray-200 text-gray-600 font-medium"
            @click="goImportMnemonic()"
          >
            Already have a wallet?
          </button>
        </div>
      </div>
    </div>
    <div class="py-4">
      <span class="text-xl break-all pl-1">
        <span class="text-gray-500"> Address: </span>
        <span class="font-medium border-b-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-900 dark:text-white rounded pl-2 pr-2">{{ $store.state.RegisterModule.address }}</span>
      </span>
    </div>
    <div class="pt-4 text-xl">
      <span class="text-gray-500"> Mnemonic: </span>
    </div>
    <div class="grid grid-cols-8 gap-x-8 gap-y-4 pt-2">
      <div
        v-for="(word,index) in $store.state.RegisterModule.mnemonic"
        :key="word"
        class="col-span-4 lg:col-span-2 border-b-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-900 rounded"
      >
        <span class="pl-1">
          <span class="select-none text-sm align-middle text-gray-500 pr-1">{{ index+1 }}</span> <span class="text-xl dark:text-white">{{ word }}</span>
        </span>
      </div>
    </div>
    <div class="text-right text-sm grid grid-cols-12 pt-6">
      <div class="col-span-9 text-left my-auto">
        <h4 class="lg:text-lg font-medium dark:text-white">
          These words are the only way to recover your account, store it in a secure place!
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
    <div class="pt-8">
      <input
        id="hasWroteMnemonic"
        v-model="hasWroteMnemonic"
        type="checkbox"
      >
      <label
        for="hasWroteMnemonic"
        class="select-none dark:text-white"
      > I saved my mnemonic on a secure place!</label><br>
    </div>
    <div
      v-if="hasWroteMnemonic===true"
      class="py-10"
    >
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

<script lang="ts" src="./RegisterNewWallet.ts"/>
