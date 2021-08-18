<template>
  <div class="">
    <div class="mt-8 space-y-6 w-11/12 mx-auto">
      <h2 class="font-bold text-2xl text-brand">
        Wallet Password
      </h2>
      <!-- Password -->
      <div>
        <label class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl">Password</label>
        <input
          v-model="inputMPassword"
          :class="{'border-red-700 dark:border-red-700': hasLoginError, 'focus:border-brand dark:border-gray-700': !isTouched}"
          type="password"
          required="required"
          class="relative block w-full px-3 py-2 mt-2 border border-gray-300 dark:border-gray-500 placeholder-gray-300 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-600 dark:text-white"
          placeholder="Wallet Password"
        >
      </div>

      <div>
        <button
          v-if="inputMPassword.length>3"
          type="button"
          class="relative block w-full justify-center py-2 px-4 border border-transparent text-md rounded-md font-extrabold
               text-white bg-brand opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-denim-900 focus:ring-brand"
          @click="signin()"
        >
          Continue
          <span class="absolute right-0 inset-y-0 flex items-center pr-3">
            <i class="bi bi-arrow-right" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
        
<script lang="tsx" src="./LoginFormMPassword.ts"/>
