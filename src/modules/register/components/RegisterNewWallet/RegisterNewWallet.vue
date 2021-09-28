<template>
  <div>
    <div>
      <div class="text-gray-500 text-sm pb-5">
        <button @click="goBack()">
          <i class="bi bi-arrow-left" /> Change Wallet password
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

    <InputMnemonic
      :generated-mnemonic="mnemonic"
      :is-new="true"
    />

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
